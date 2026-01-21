import {
  Editor,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnNumberedList,
  BtnBulletList,
  BtnClearFormatting,
  BtnUndo,
  BtnRedo,
  Separator,
  Toolbar,
  BtnLink,
  EditorProvider,
} from "react-simple-wysiwyg";

export default function RichTextEditor({ value, onChange, readOnly = false }) {
  // Fix: extract text value from event
  const handleChange = (e) => {
    if (onChange) onChange(e.target.value);
  };

  return (
    <EditorProvider>
      <Editor
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        containerProps={{
          style: {
            height: "100%",
            border: "none",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {!readOnly && (
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
            <Separator />
            <BtnClearFormatting />
            <BtnUndo />
            <BtnRedo />
          </Toolbar>
        )}
      </Editor>
    </EditorProvider>
  );
}
