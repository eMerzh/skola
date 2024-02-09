import classes from "./CardEditor.module.css";
import React from "react";
import { BubbleMenu, Editor, EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Image from "@tiptap/extension-image";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { CardEditorControls } from "./CardEditorControls";
import { useSettings } from "../../../logic/Settings";

interface CardEditorProps {
  editor: Editor | null;
  className?: string;
  controls?: React.ReactNode;
}

export function useCardEditor(props: {
  content: string;
  onUpdate?: EditorOptions["onUpdate"];
  extensions?: any[];
}) {
  return useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Color,
        TextStyle,
        Image.configure({
          allowBase64: true,
        }),
        ...(props.extensions ?? []),
      ],
      content: props.content,
      onUpdate: props.onUpdate || (() => {}), // tiptap default
    },
    [props.content]
  );
}

function CardEditor({ editor, controls, className }: CardEditorProps) {
  const [settings, areSettingsReady] = useSettings();

  return (
    <RichTextEditor
      editor={editor}
      withTypographyStyles={false}
      className={className}
      classNames={{
        root: classes.root,
        toolbar: classes.toolbar,
        content: classes.content,
      }}
    >
      {areSettingsReady && (
        <>
          {editor && settings.useToolbar && (
            <RichTextEditor.Toolbar className={classes.toolbar}>
              <CardEditorControls controls={controls} editor={editor} />
            </RichTextEditor.Toolbar>
          )}
          {editor && settings.useBubbleMenu && (
            <BubbleMenu editor={editor}>
              <CardEditorControls controls={controls} editor={editor} />
            </BubbleMenu>
          )}
        </>
      )}

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}

export default CardEditor;
