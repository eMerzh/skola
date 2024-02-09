import classes from "./CardEditor.module.css";
import { RichTextEditor } from "@mantine/tiptap";
import AddImageControl from "../AddImageControl";
import EditorOptionsMenu from "../EditorOptionsMenu";
import { Box } from "@mantine/core";
import { useSettings } from "../../../logic/Settings";
import { Editor } from "@tiptap/react";

export interface CardEditorControlsProps {
  editor: Editor | null;
  controls?: React.ReactNode;
}

export function CardEditorControls({
  editor,
  controls,
}: CardEditorControlsProps) {
  const [settings] = useSettings();
  return (
    <Box className={classes.controlsWrapper}>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold tabIndex={-1} />
        <RichTextEditor.Italic tabIndex={-1} />
        <RichTextEditor.Underline tabIndex={-1} />
        {settings.showStrikethroughOptionInEditor && (
          <RichTextEditor.Strikethrough tabIndex={-1} />
        )}
        {settings.showHighlightOptionInEditor && (
          <RichTextEditor.Highlight tabIndex={-1} />
        )}
        {settings.showCodeOptionInEditor && (
          <RichTextEditor.Code tabIndex={-1} />
        )}
        {settings.showSubAndSuperScriptOptionInEditor && (
          <>
            <RichTextEditor.Subscript tabIndex={-1} />
            <RichTextEditor.Superscript tabIndex={-1} />
          </>
        )}

        <RichTextEditor.ClearFormatting tabIndex={-1} />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        {settings.showListOptionInEditor && (
          <>
            <RichTextEditor.BulletList tabIndex={-1} />
            <RichTextEditor.OrderedList tabIndex={-1} />
          </>
        )}

        <AddImageControl editor={editor} />
      </RichTextEditor.ControlsGroup>

      {settings.showLinkOptionInEditor && (
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link tabIndex={-1} />
          <RichTextEditor.Unlink tabIndex={-1} />
        </RichTextEditor.ControlsGroup>
      )}
      <RichTextEditor.ControlsGroup>{controls}</RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <EditorOptionsMenu />
      </RichTextEditor.ControlsGroup>
    </Box>
  );
}
