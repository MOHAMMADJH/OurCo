import React, { useState, useEffect, useRef, memo } from "react";
import { Card } from "@/components/ui/card";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ErrorBoundary from '@/components/ErrorBoundary';

interface RichTextEditorProps {
  /**
   * The initial content to display in the editor
   */
  value: string;
  /**
   * Callback function when content changes
   */
  onChange: (value: string) => void;
  /**
   * Editor height in pixels
   * @default 400
   */
  height?: number;
  /**
   * Set to true to show border
   * @default true
   */
  showBorder?: boolean;
  /**
   * Error message to display
   */
  error?: string;
}

/**
 * Rich Text Editor component using CKEditor with Arabic language and RTL support
 */
const RichTextEditor = memo(({ 
  value = '', 
  onChange, 
  height = 400,
  showBorder = true,
  error
}: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [editorData, setEditorData] = useState('');
  const isMounted = useRef(true);

  // Cleanup function to destroy editor on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (editorRef.current) {
        editorRef.current.destroy().then(() => {
          console.log('CKEditor destroyed successfully');
          editorRef.current = null;
        }).catch((error: any) => {
          console.error('Error destroying CKEditor:', error);
        });
      }
    };
  }, []);

  // Initialize editor when it's ready
  const handleEditorReady = (editor: any) => {
    if (isMounted.current) {
      editorRef.current = editor;
      setEditorReady(true);
      setEditorData(value);
    }
  };

  // Handle content changes
  const handleChange = (event: any, editor: any) => {
    if (editorReady && editor && typeof editor.getData === 'function' && isMounted.current) {
      const data = editor.getData();
      onChange(data);
    }
  };

  // Update local state when value prop changes
  useEffect(() => {
    if (editorReady && isMounted.current) {
      setEditorData(value);
    }
  }, [editorReady, value]);

  // Update editor content when local state changes
  useEffect(() => {
    if (editorReady && editorRef.current) {
      editorRef.current.setData(editorData);
    }
  }, [editorReady, editorData]);

  return (
    <ErrorBoundary fallback={<div className="p-4 text-red-500">خطأ في تحميل المحرر</div>}>
      <div className="rich-text-editor">
        <Card className={`overflow-hidden ${showBorder ? 'border-white/10' : 'border-0'} ${error ? 'border-red-500' : ''}`}>
          <div className="relative" style={{ height: `${height}px` }}>
            <CKEditor
              editor={ClassicEditor}
              data={editorData}
              config={{
                language: 'ar',
                toolbar: [
                  'heading', '|', 
                  'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                  'outdent', 'indent', '|',
                  'blockQuote', 'insertTable', 'undo', 'redo'
                ],
                heading: {
                  options: [
                    { model: 'paragraph', title: 'فقرة', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'عنوان 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'عنوان 2', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'عنوان 3', class: 'ck-heading_heading3' }
                  ]
                },
                extraPlugins: [
                  function(editor: any) {
                    editor.ui.getEditableElement().parentElement.setAttribute('dir', 'rtl');
                  }
                ]
              }}
              onReady={handleEditorReady}
              onChange={handleChange}
            />
          </div>
        </Card>
        {error && (
          <p className="mt-1 text-right text-sm text-red-500">{error}</p>
        )}
      </div>
    </ErrorBoundary>
  );
});

export default RichTextEditor;
