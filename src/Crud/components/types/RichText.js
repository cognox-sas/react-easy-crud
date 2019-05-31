import React, { useState, useContext, useEffect } from 'react';
import {
  EditorState,
  convertFromRaw,
  convertToRaw as convertToRawLib,
  ContentState,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import PropTypes from 'prop-types';
import { ReactEasyCrudContext } from '../../../Context';

const convertRichToRawContent = (rich, convertToRaw) =>
  convertToRaw(rich.getCurrentContent(), convertToRawLib);

const convertHtmlToRich = (raw = ' ', htmlToDraft) => {
  const contentBlock = htmlToDraft(raw);
  if (contentBlock) {
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    return EditorState.createWithContent(contentState);
  }
};

const convertMdToRich = (raw = '', markdownToDraft) =>
  EditorState.createWithContent(markdownToDraft(raw, convertFromRaw));

const RichText = ({
  onChange,
  value,
  typeFormat,
  convertToRaw,
  convertToDraft,
}) => {
  const { localize } = useContext(ReactEasyCrudContext);
  const [editorState, setContent] = useState(EditorState.createEmpty());

  const onChangeEditor = richText => {
    const rawContent = convertRichToRawContent(richText, convertToRaw);
    onChange(rawContent);
    setContent(richText);
  };

  useEffect(() => {
    if (typeFormat === 'markdown') {
      setContent(convertMdToRich(value, convertToDraft));
    } else if (typeFormat === 'html') {
      setContent(convertHtmlToRich(value, convertToDraft));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Editor
      editorState={editorState}
      wrapperClassName="custom-rich-wrapper"
      editorClassName="custom-rich-editor"
      onEditorStateChange={onChangeEditor}
      localization={{
        locale: localize || 'en',
      }}
    />
  );
};

RichText.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  typeFormat: PropTypes.oneOf(['html', 'markdown']),
  convertToRaw: PropTypes.func,
  convertToDraft: PropTypes.func,
};

export default RichText;
