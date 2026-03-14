import Link from "next/link";
import { blogData } from "@/lib/blogData";

export default function JournalAllPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Geist:wght@300;400;500;600&display=swap');

        :root {
          --bg: #050505;
          --gold: #c8a95c;
          --text: #f2f2f2;
          --muted: rgba(255, 255, 255, 0.6);
        }

        .mk-journal-all,
        .mk-journal-all * {
          box-sizing: border-box;
        }

        .mk-journal-all {
          background: var(--bg);
          font-family: "Geist", sans-serif;
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .mk-journal-all nav {
          padding: 30px 40px;
          display: flex;
          justify-content: space-between;
        }

        .mk-journal-all nav a {
          color: var(--text);
          text-decoration: none;
          font-size: 0.8rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }

        .mk-journal-all nav a:hover {
          color: var(--gold);
        }

        .mk-journal-all header {
          text-align: center;
          padding: 10vh 20px 8vh;
        }

        .mk-journal-all .header-label {
          font-size: 0.75rem;
          letter-spacing: 4px;
          margin-bottom: 25px;
          display: block;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 600;
        }

        .mk-journal-all header h1 {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .mk-journal-all .journal-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px 100px;
        }

        .mk-journal-all .journal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 40px;
        }

        .mk-journal-all .article-card {
          text-decoration: none;
          color: var(--text);
          display: block;
        }

        .mk-journal-all .image-wrapper {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .mk-journal-all .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.6);
          transition: transform 0.8s ease, filter 0.8s ease;
        }

        .mk-journal-all .article-card:hover .image-wrapper img {
          transform: scale(1.05);
          filter: brightness(0.9);
        }

        .mk-journal-all .card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
          color: var(--gold);
        }

        .mk-journal-all .card-date {
          color: var(--muted);
        }

        .mk-journal-all .card-title {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.8rem;
          font-weight: 400;
          line-height: 1.2;
          margin-bottom: 10px;
          transition: color 0.4s ease;
        }

        .mk-journal-all .article-card:hover .card-title {
          color: var(--gold);
        }

        .mk-journal-all .card-summary {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <main className="mk-journal-all">
        <nav>
          <Link href="/blog">{"← Featured Journal"}</Link>
        </nav>

        <header>
          <span className="header-label">Archive</span>
          <h1>All Articles</h1>
        </header>

        <div className="journal-container">
          <div className="journal-grid">
            {blogData.map((article) => (
              <Link key={article.id} href={`/blog/article_template?id=${article.id}`} className="article-card">
                <div className="image-wrapper">
                  <img src={article.image} alt={article.title} />
                </div>
                <div className="card-meta">
                  <span>{article.category}</span>
                  <span className="card-date">{article.date}</span>
                </div>
                <h2 className="card-title">{article.title}</h2>
                <p className="card-summary">{article.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
