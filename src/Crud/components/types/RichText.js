import React, { useState, useEffect, useContext } from 'react';
import {
  convertFromHTML,
  EditorState,
  convertToRaw,
  ContentState,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import PropTypes from 'prop-types';
import { ReactEasyCrudContext } from '../../../Context';

const richValue = value => {
  if (!value) {
    return EditorState.createEmpty();
  }

  const blocks = convertFromHTML(value || '<p> </p>');
  const state = ContentState.createFromBlockArray(
    blocks.contentBlocks,
    blocks.entityMap
  );
  return EditorState.createWithContent(state);
};

const RichText = ({ onChange, value }) => {
  const { localize } = useContext(ReactEasyCrudContext);
  const [content, setContent] = useState(richValue(value));
  const htmlValue = draftToHtml(convertToRaw(content.getCurrentContent()));
  useEffect(() => {
    onChange(htmlValue && htmlValue.trim() === '<p></p>' ? '' : htmlValue);
  }, [content, htmlValue, onChange]);

  return (
    <Editor
      editorState={content}
      wrapperClassName="custom-rich-wrapper"
      editorClassName="custom-rich-editor"
      onEditorStateChange={e => setContent(e)}
      localization={{
        locale: localize,
      }}
    />
  );
};

RichText.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default RichText;
