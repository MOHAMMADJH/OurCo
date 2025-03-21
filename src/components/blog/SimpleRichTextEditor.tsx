import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './simple-editor.css';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const SimpleRichTextEditor: React.FC<SimpleRichTextEditorProps> = ({ value, onChange }) => {
  const [editorData, setEditorData] = useState(value || '');
  const [editorLoaded, setEditorLoaded] = useState(false);

  // Update local data when prop changes
  useEffect(() => {
    setEditorData(value || '');
  }, [value]);

  // Mark as loaded after component mounts
  useEffect(() => {
    setEditorLoaded(true);
    return () => {
      setEditorLoaded(false);
    };
  }, []);

  if (!editorLoaded) {
    return (
      <div className="min-h-[300px] flex items-center justify-center border rounded p-4 bg-white/5 text-white">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="simple-editor-container">
      {/* Basic CKEditor implementation */}
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onReady={(editor: any) => {
          console.log('Editor is ready to use!', editor);
          
          // Set RTL direction
          if (editor && editor.editing && editor.editing.view && editor.editing.view.document) {
            const viewRoot = editor.editing.view.document.getRoot();
            if (viewRoot) {
              editor.editing.view.change((writer: any) => {
                writer.setAttribute('dir', 'rtl', viewRoot);
              });
            }
          }
        }}
        onChange={(_event: any, editor: any) => {
          try {
            const data = editor.getData();
            setEditorData(data);
            onChange(data);
          } catch (error) {
            console.error('Error getting editor data:', error);
          }
        }}
        onError={(error: any) => {
          console.error('CKEditor error:', error);
        }}
        config={{
          language: 'ar',
          toolbar: [
            'heading', '|',
            'bold', 'italic', '|',
            'bulletedList', 'numberedList'
          ]
        }}
      />
    </div>
  );
};

export default SimpleRichTextEditor;
