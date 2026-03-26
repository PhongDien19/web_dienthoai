// src/pages/BlogDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { blogApi } from "../api/blogs";

function formatBlogDate(createdAt) {
  const d = new Date(createdAt);
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })
    .toUpperCase();
}

function blogTag(type) {
  return type === "Lookbook" ? "LOOKBOOK" : "LIFESTYLE";
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    blogApi
      .getBySlug(slug)
      .then((res) => setBlog(res))
      .catch(() => setError("Không tìm thấy bài viết."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        Đang tải...
      </div>
    );

  if (error || !blog)
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        {error || "Không có dữ liệu"}
      </div>
    );

  return (
    <div
      style={{ backgroundColor: "var(--craft-cream)" }}
      className="min-h-screen pb-20 pt-8"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 mb-8"
        >
          <ChevronLeft size={16} /> Quay lại Tin tức
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase px-3 py-1 bg-amber-100 text-amber-700 rounded-full mb-4">
            {blogTag(blog.type)}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-stone-800">
            {blog.title}
          </h1>

          <p className="text-stone-500 text-sm">
            Đăng ngày: {formatBlogDate(blog.createdAt)}
          </p>
        </div>

        {/* ẢNH (ĐÃ FIX) */}
        {blog.coverImageUrl && (
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-xl">
            <img
              src={blog.coverImageUrl || "/images/no-image.jpg"}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
