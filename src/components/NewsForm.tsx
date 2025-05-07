import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

type NewsFormProps = {
  title: string;
  content: string;
  setTitle: (val: string) => void;
  setContent: (val: string) => void;
  previewImages: string[];
  previewFiles: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  removeFile: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error?: string | null;
  isEdit?: boolean;
  onCancel?: () => void;
};

export const NewsForm: React.FC<NewsFormProps> = ({
  title,
  content,
  setTitle,
  setContent,
  previewImages,
  previewFiles,
  handleImageChange,
  handleFileChange,
  removeImage,
  removeFile,
  handleSubmit,
  error,
  isEdit = false,
  onCancel,
}) => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Редактировать новость" : "Создать новость"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <Box sx={{ mt: 2, p: 2, backgroundColor: "#f0f0f0", borderRadius: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            💡 Поддерживается Markdown-разметка:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Поддерживается Markdown форматирование:
            <br />
            **жирный текст**
            <br />
            *курсив*
            <br />
            {">"} цитата
            <br />
            ```код```
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Содержание (Markdown)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          multiline
          minRows={8}
        />

        <Box sx={{ mt: 2 }}>
          <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              p: ({ children }) => (
                <Typography variant="body1" paragraph>
                  {children}
                </Typography>
              ),
              h1: ({ children }) => (
                <Typography variant="h4" gutterBottom>
                  {children}
                </Typography>
              ),
              h2: ({ children }) => (
                <Typography variant="h5" gutterBottom>
                  {children}
                </Typography>
              ),
              h3: ({ children }) => (
                <Typography variant="h6" gutterBottom>
                  {children}
                </Typography>
              ),
              li: ({ children }) => (
                <li style={{ marginLeft: "1.2em" }}>{children}</li>
              ),
              blockquote: ({ children }) => (
                <Box
                  component="blockquote"
                  sx={{
                    borderLeft: "4px solid #ccc",
                    paddingLeft: 2,
                    marginY: 2,
                    color: "gray",
                  }}
                >
                  {children}
                </Box>
              ),
              code: ({ inline, className, children }: any) => {
                return !inline ? (
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: "#f6f8fa",
                      padding: 2,
                      borderRadius: 2,
                      overflowX: "auto",
                      my: 2,
                    }}
                    className={className}
                  >
                    <code>{children}</code>
                  </Box>
                ) : (
                  <code
                    style={{
                      backgroundColor: "#f6f8fa",
                      padding: "2px 4px",
                      borderRadius: 4,
                    }}
                  >
                    {children}
                  </code>
                );
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <input
            accept="image/*"
            type="file"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span">
              Добавить изображения
            </Button>
          </label>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {previewImages.map((src, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box sx={{ position: "relative" }}>
                  <img
                    src={src}
                    alt={`Preview ${i}`}
                    style={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 0, right: 0 }}
                    onClick={() => removeImage(i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 3 }}>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span">
              Добавить файлы
            </Button>
          </label>
          <Box sx={{ mt: 2 }}>
            {previewFiles.map((name, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography>{name}</Typography>
                <IconButton size="small" onClick={() => removeFile(i)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" size="large">
            {isEdit ? "Сохранить изменения" : "Опубликовать"}
          </Button>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel} size="large">
              Отмена
            </Button>
          )}
        </Box>

        {error && <Typography color="error">{error}</Typography>}
      </form>
    </Box>
  );
};
