import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './ckeditor-custom.css';

interface CKRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CKRichTextEditor: React.FC<CKRichTextEditorProps> = ({ value, onChange }) => {
  // Simple state to track editor content
  const [content, setContent] = useState(value || '');

  // Update content when value prop changes
  useEffect(() => {
    setContent(value || '');
  }, [value]);

  return (
    <div className="ckeditor-container" data-component-name="CKRichTextEditor">
      {/* CKEditor component */}
      <CKEditor
        editor={ClassicEditor}
        data={content}
        config={{
          language: 'ar',
          toolbar: [
            'heading',
            '|',
            'bold', 'italic', 'link', 'bulletedList', 'numberedList',
            '|',
            'outdent', 'indent',
            '|',
            'blockQuote', 'insertTable', 'undo', 'redo'
          ],
          removePlugins: ['Title'],
        }}
        onReady={(editor: any) => {
          // Set RTL direction for the editor
          if (editor && editor.editing && editor.editing.view && editor.editing.view.document) {
            const viewRoot = editor.editing.view.document.getRoot();
            if (viewRoot) {
              editor.editing.view.change((writer: any) => {
                writer.setAttribute('dir', 'rtl', viewRoot);
                writer.addClass('ck-rtl', viewRoot);
              });
            }
          }
          
          // Log success message
          console.log('CKEditor is ready to use!');
        }}
        onChange={(_event: any, editor: any) => {
          const data = editor.getData();
          setContent(data);
          onChange(data);
        }}
        onError={(error: any) => {
          console.error('CKEditor error:', error);
        }}
      />
    </div>
  );
};

export default CKRichTextEditor;
