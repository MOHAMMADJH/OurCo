import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-custom.css';

// Fix for DOMNodeInserted warning
// This will be applied when Quill is initialized
const suppressDOMNodeInsertedWarning = () => {
  // Store the original addEventListener
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  
  // Override addEventListener to intercept DOMNodeInserted
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'DOMNodeInserted') {
      // Don't add the event listener for this deprecated event
      return;
    }
    // Call the original method for all other events
    return originalAddEventListener.call(this, type, listener, options);
  };
};

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const [editorContent, setEditorContent] = useState(value || '');
  const quillRef = useRef<ReactQuill>(null);
  
  // Apply the fix for DOMNodeInserted warning when component mounts
  useEffect(() => {
    suppressDOMNodeInsertedWarning();
  }, []);

  // Update local content when prop changes
  useEffect(() => {
    setEditorContent(value || '');
  }, [value]);

  // Handle content change
  const handleChange = (content: string) => {
    setEditorContent(content);
    onChange(content);
  };

  // Simple modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  // Arabic format for editor
  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className="quill-editor-container" dir="rtl">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorContent}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="أدخل محتوى المقال هنا..."
      />
    </div>
  );
};

export default QuillEditor;
