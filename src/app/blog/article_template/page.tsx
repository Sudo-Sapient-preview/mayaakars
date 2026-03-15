"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getArticleById } from "@/lib/blogData";

function ArticleTemplateContent() {
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");
  const article = getArticleById(articleId);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Mayaakars Journal`;
      return;
    }
    document.title = "Article Not Found | Mayaakars";
  }, [article]);

  return (
    <>
      <main className="mk-article-page">
        {article ? (
          <>
            <header className="article-hero">
              <img src={article.image} alt="Hero Image" className="hero-bg" />
              <div className="hero-overlay" />
              <div className="category-badge">{article.category}</div>
              <h1 className="article-title">{article.title}</h1>
              <div className="article-meta">{article.date}</div>
            </header>

            <article className="article-body">
              <div className="summary-block">{article.summary}</div>
              <div className="content" dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>
          </>
        ) : (
          <div className="error-state">
            <h1>Article Not Found</h1>
            <p style={{ color: "var(--muted)", marginBottom: "30px" }}>
              The journal entry you are looking for does not exist.
            </p>
            <Link
              href="/journal"
              style={{ color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid var(--gold)", paddingBottom: "5px" }}
            >
              Return to Journal
            </Link>
          </div>
        )}

        <section className="article-footer-nav">
          <Link href="/journal" className="article-back-btn" data-interactive>
            Back to Journal
          </Link>
        </section>
      </main>
    </>
  );
}

export default function ArticleTemplatePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Geist:wght@300;400;500;600&display=swap');

        :root {
          --bg: #050505;
          --gold: #c8a95c;
          --text: #f2f2f2;
          --muted: rgba(255, 255, 255, 0.7);
        }

        .mk-article-page,
        .mk-article-page * {
          box-sizing: border-box;
        }

        .mk-article-page {
          background: var(--bg);
          font-family: "Geist", sans-serif;
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .mk-article-page .article-hero {
          position: relative;
          width: 100%;
          height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 40px 10%;
        }

        .mk-article-page .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
          filter: brightness(0.4);
        }

        .mk-article-page .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--bg) 0%, transparent 60%);
          z-index: -1;
        }

        .mk-article-page .category-badge {
          color: var(--gold);
          font-size: 0.75rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .mk-article-page .article-title {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 400;
          line-height: 1.1;
          max-width: 900px;
          margin-bottom: 20px;
        }

        .mk-article-page .article-meta {
          font-size: 0.85rem;
          color: var(--muted);
          letter-spacing: 1px;
          margin-bottom: 10px;
        }

        .mk-article-page .article-body {
          max-width: 760px;
          margin: 60px auto 120px;
          padding: 0 30px;
        }

        .mk-article-page .summary-block {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.6rem;
          line-height: 1.5;
          color: var(--gold);
          margin-bottom: 50px;
          font-style: italic;
        }

        .mk-article-page .content p {
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 30px;
          color: rgba(255, 255, 255, 0.85);
        }

        .mk-article-page .content h3 {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.8rem;
          font-weight: 400;
          margin: 50px 0 20px;
          color: #fff;
        }

        .mk-article-page .error-state {
          height: 80vh;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          display: flex;
        }

        .mk-article-page .error-state h1 {
          font-family: "Cormorant Garamond", serif;
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .mk-article-page .article-footer-nav {
          padding: 0 30px 88px;
          display: flex;
          justify-content: center;
        }

        .mk-article-page .article-back-btn {
          border: 1px solid rgba(242, 242, 242, 0.85);
          border-radius: 9999px;
          background: transparent;
          color: #f2f2f2;
          padding: 0.85rem 2rem;
          font-size: 0.9rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }

        .mk-article-page .article-back-btn:hover {
          background: #e3e4e0;
          color: #050505;
          border-color: #e3e4e0;
        }

        @media (max-width: 768px) {
          .mk-article-page .article-footer-nav {
            padding: 0 20px 72px;
          }

          .mk-article-page .article-back-btn {
            width: 100%;
            max-width: 320px;
            text-align: center;
            font-size: 0.82rem;
            letter-spacing: 0.12em;
          }
        }
      `}</style>

      <Suspense fallback={null}>
        <ArticleTemplateContent />
      </Suspense>
    </>
  );
}
