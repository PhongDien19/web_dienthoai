// src/pages/BlogPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { blogApi } from "../api/blogs";
import { resolveImage } from "../utils/imageResolver";

function formatBlogDate(createdAt) {
  const d = new Date(createdAt);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function blogTag(type) {
  return type === "Lookbook" ? "LOOKBOOK" : "TIN TỨC";
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const res = await blogApi.getAll({
          page,
          pageSize: 9,
        });

        if (!isMounted) return;

        setBlogs(res?.items || []);
        setTotal(res?.total || 0);
      } catch (err) {
        console.error("Lỗi load blog:", err);
        if (isMounted) {
          setBlogs([]);
          setTotal(0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* BANNER */}
      <div className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1510557880182-3c5a9a5c5c03?auto=format&fit=crop&w=1600&q=80"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/50"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Tin tức công nghệ</h1>
          <p className="text-sm text-blue-100 mt-2">
            Cập nhật xu hướng điện thoại mới nhất
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video skeleton rounded-xl" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Chưa có bài viết nào.
          </div>
        ) : (
          <>
            {/* LIST BLOG */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
                >
                  {/* IMAGE */}
                  <div className="aspect-video bg-gray-100 overflow-hidden relative">
                    <img
                      src={resolveImage(
                        post.coverImageUrl,
                        "https://placehold.co/600x400?text=Blog",
                      )}
                      alt={post.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {blogTag(post.type)}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">
                      {formatBlogDate(post.createdAt)}
                    </p>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                      {post.title}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION */}
            {total > 9 && (
              <div className="mt-10 flex justify-center items-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
                >
                  Trang trước
                </button>

                <span className="text-sm text-gray-500">Trang {page}</span>

                <button
                  disabled={page * 9 >= total}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-blue-700"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
