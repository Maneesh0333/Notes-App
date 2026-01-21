import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiAxios from "@/api/apiAxios";
import { useAuth } from "@/auth/authContext";
import { toast } from "react-toastify";
import { Plus, Trash } from "lucide-react";

const schema = yup.object().shape({
  name: yup.string().min(3).required("Name is required"),
});

const cardColors = [
  "bg-yellow-200",
  "bg-orange-200",
  "bg-green-200",
  "bg-purple-200",
  "bg-blue-200",
];

function CreateNote() {
  const { user } = useAuth();
  const token = user?.accessToken;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  /* =======================
     FETCH NOTES
  ======================= */
  const {
    data: notes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes"],
    enabled: !!token,
    queryFn: async () => {
      const res = await apiAxios.get("/api/notes/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
  });

  /* =======================
     CREATE NOTE
  ======================= */
  const createNoteMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await apiAxios.post(
        "/api/notes/create",
        { ...formData, content: "" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Note created!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      reset();
      setIsOpen(false);
      navigate(`/notes/${data.note._id}`);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to create note"),
  });

  /* =======================
     DELETE NOTE
  ======================= */
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId) => {
      const res = await apiAxios.delete(`/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Note deleted");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete note"),
  });

  if (isLoading) return <p className="text-center mt-20">Loading notes...</p>;

  if (isError)
    return (
      <p className="text-center mt-20 text-red-500">Failed to load notes</p>
    );

  return (
    <div className="w-full flex flex-col items-center px-6 py-10 bg-white overflow-y-auto">
      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
        {/* Add Note Card */}
        <div
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center rounded-2xl bg-gray-100 shadow-md hover:shadow-xl cursor-pointer transition h-44"
        >
          <Plus className="w-10 h-10 text-black" />
        </div>

        {notes.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No notes yet. Click + to create one.
          </p>
        )}

        {notes.map((note, index) => {
          const bgColor = cardColors[index % cardColors.length];

          return (
            <div
              key={note._id}
              onClick={() => navigate(`/notes/${note._id}`)}
              className={`relative h-44 p-5 rounded-2xl ${bgColor} shadow-md hover:shadow-xl hover:-translate-y-1 transition cursor-pointer`}
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNote(note);
                  setIsDeleteOpen(true);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black flex items-center justify-center hover:bg-gray-800"
              >
                <Trash size={14} className="text-white" />
              </button>

              <h3 className="text-lg font-semibold text-gray-900 line-clamp-3">
                {note.name}
              </h3>

              <p className="absolute bottom-4 left-5 text-xs text-gray-700">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* CREATE NOTE MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit(createNoteMutation.mutate)}>
              <label className="block mb-2 font-medium">Name</label>

              <input
                {...register("name")}
                className="
    w-full px-4 py-2 rounded-lg
    border border-gray-300
    focus:border-green-500
    focus:ring-2 focus:ring-green-400
    focus:outline-none
  "
                placeholder="Enter note name"
                autoFocus
              />

              {formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {formState.errors.name.message}
                </p>
              )}

              <div className="flex gap-4 mt-5">
                <button
                  type="submit"
                  disabled={!formState.isValid || createNoteMutation.isLoading}
                  className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  {createNoteMutation.isLoading ? "Creating..." : "Create"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setIsDeleteOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-2">Delete Note</h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{selectedNote?.name}"</span>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-5 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteNoteMutation.mutate(selectedNote._id);
                  setIsDeleteOpen(false);
                }}
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateNote;
