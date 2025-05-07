import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardMedia,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { env } from "../config/env";
import { INews } from "../types/common";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

export const NewsDetail: React.FC = () => {
  const [news, setNews] = useState<INews | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${env.API_URL}${env.API_ROUTES.NEWS.BY_ID(id!)}`
        );
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${env.API_URL}${env.API_ROUTES.NEWS.BY_ID(id!)}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  if (!news) {
    return <Typography>Загрузка...</Typography>;
  }

  const isAuthor = user?.email === news.author.email;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {news.title}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Автор: {news.author.email}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {new Date(news.createdAt).toLocaleDateString()}
        </Typography>

        {news.images && news.images.length > 0 && (
          <Grid container spacing={2} sx={{ my: 2 }}>
            {news.images.map((image, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${env.UPLOADS_URL}/${image}`}
                    alt={`Изображение ${index + 1}`}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ mt: 2 }}>
          <ReactMarkdown
            children={news.content}
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

        {news.files && news.files.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Прикрепленные файлы:
            </Typography>
            {news.files.map((file, index) => (
              <Button
                key={index}
                variant="outlined"
                href={`${env.UPLOADS_URL}/${file}`}
                target="_blank"
                sx={{ mr: 2, mb: 2 }}
              >
                Скачать файл {index + 1}
              </Button>
            ))}
          </Box>
        )}

        {isAuthor && (
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/news/edit/${news._id}`)}
            >
              Редактировать
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Удалить
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
