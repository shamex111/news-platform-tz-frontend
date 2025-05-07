import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { env } from "../config/env";
import { NewsForm } from "./NewsForm";

export const CreateNews: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewFiles, setPreviewFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...files]);
      setPreviewFiles((prev) => [...prev, ...files.map((f) => f.name)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((img) => formData.append("images", img));
    files.forEach((f) => formData.append("files", f));

    try {
      await axios.post(`${env.API_URL}${env.API_ROUTES.NEWS.BASE}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Ошибка при создании новости");
    }
  };

  return (
    <NewsForm
      title={title}
      content={content}
      setTitle={setTitle}
      setContent={setContent}
      previewImages={previewImages}
      previewFiles={previewFiles}
      handleImageChange={handleImageChange}
      handleFileChange={handleFileChange}
      removeImage={(i) => {
        setImages((prev) => prev.filter((_, idx) => idx !== i));
        setPreviewImages((prev) => prev.filter((_, idx) => idx !== i));
      }}
      removeFile={(i) => {
        setFiles((prev) => prev.filter((_, idx) => idx !== i));
        setPreviewFiles((prev) => prev.filter((_, idx) => idx !== i));
      }}
      handleSubmit={handleSubmit}
      error={error}
      onCancel={() => navigate("/")}
    />
  );
};
