import React, { useEffect, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiAxios from "@/api/apiAxios";
import { Save } from "lucide-react";
import { toast } from "react-toastify";

const NotesApp = () => {
  const [text, setText] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch note content
  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await apiAxios.get(`/notes/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (note?.content) setText(note.content);
  }, [note]);

  
  // ✅ Mutation to save note
  const saveMutation = useMutation({
    mutationFn: async (content) => {
      const res = await apiAxios.put(`/notes/${id}`, { content });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Note saved!");
      navigate("/create-notes");
    },
    onError: (err) => {
      const message =
        err.response?.data?.message || err.message || "Failed to save note";
      toast.error(message);
    },
    enabled: !!id,
  });

  if (isLoading) return <p className="text-center h-full flex items-center justify-center">Loading...</p>;
  if (isError)
    return (
      <p className="text-center h-full flex items-center justify-center text-red-500">Error: {error.message}</p>
    );

    console.log("note: ", note)
  return (
    <div className="flex flex-col items-center justify-center w-full h-fit lg:h-full py-10 px-4 sm:px-6 md:px-10 bg-green-50 text-center font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 w-full gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-600 break-words">
          {note.name}
        </h1>
        <button
          onClick={() => saveMutation.mutate(text)}
          disabled={saveMutation.isPending}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-md hover:bg-green-700 transition font-semibold w-full sm:w-auto"
        >
          <Save size={20} />
          {saveMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Editor & Preview */}
      <div className="flex flex-col lg:flex-row gap-5 w-full max-w-6xl">
        {/* Rich Text Editor */}
        <div className="flex-1 text-left min-h-[300px] border border-gray-300 rounded-md shadow-sm bg-white">
          <RichTextEditor value={text} onChange={setText} />
        </div>

        {/* Live Preview */}
        <div className="flex-1 text-left min-h-[300px] border border-gray-300 rounded-md shadow-sm bg-white">
          <h2 className="text-lg font-semibold p-3 border-b border-gray-200">
            Live Preview
          </h2>
          <div className="p-3 overflow-auto max-h-[600px]">
            <RichTextEditor value={text} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
