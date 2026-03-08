import { pool } from "../db/pool.js";

export async function findMany({ type, limit, offset }) {
  const { rows } = await pool.query(
    `
    SELECT
      p.id,
      p.type,
      p.title,
      p.content,
      -- ✅ 목록에서는 썸네일 1장만 (첫 이미지)
      COALESCE(
        (
          SELECT pi.image_url
          FROM post_images pi
          WHERE pi.post_id = p.id
          ORDER BY pi.sort_order ASC, pi.id ASC
          LIMIT 1
        ),
        p.image_url
      ) AS "imageUrl",
      p.youtube_url AS "youtubeUrl",
      to_char(p.created_at, 'YYYY-MM-DD') AS "createdAt"
    FROM posts p
    WHERE p.type = $1
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [type, limit, offset]
  );
  return rows;
}

export async function countByType(type) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total FROM posts WHERE type = $1`,
    [type]
  );
  return rows[0].total;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `
    SELECT
      p.id,
      p.type,
      p.title,
      p.content,
      p.youtube_url AS "youtubeUrl",
      to_char(p.created_at, 'YYYY-MM-DD') AS "createdAt",
      -- ✅ 상세에서는 images 배열
      COALESCE(
        json_agg(pi.image_url ORDER BY pi.sort_order ASC, pi.id ASC)
          FILTER (WHERE pi.id IS NOT NULL),
        '[]'::json
      ) AS "images"
    FROM posts p
    LEFT JOIN post_images pi ON pi.post_id = p.id
    WHERE p.id = $1
    GROUP BY p.id
    `,
    [id]
  );
  return rows[0] ?? null;
}

export async function insert({ type, title, content, youtubeUrl }) {
  const { rows } = await pool.query(
    `
    INSERT INTO posts (type, title, content, youtube_url)
    VALUES ($1, $2, $3, $4)
    RETURNING id, type, title, content, youtube_url AS "youtubeUrl",
              to_char(created_at, 'YYYY-MM-DD') AS "createdAt"
    `,
    [type, title, content, youtubeUrl]
  );
  return rows[0];
}

export async function insertImages(postId, images = []) {
  if (!images?.length) return;

  const values = [];
  const params = [];
  let idx = 1;

  for (let i = 0; i < images.length; i++) {
    values.push(`($${idx++}, $${idx++}, $${idx++})`);
    params.push(postId, images[i], i);
  }

  await pool.query(
    `
    INSERT INTO post_images (post_id, image_url, sort_order)
    VALUES ${values.join(", ")}
    `,
    params
  );
}

export async function removeImages(postId) {
  await pool.query(`DELETE FROM post_images WHERE post_id = $1`, [postId]);
}

export async function update(id, { type, title, content, youtubeUrl }) {
  const { rows } = await pool.query(
    `
    UPDATE posts
    SET
      type = $2,
      title = $3,
      content = $4,
      youtube_url = $5,
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, type, title, content, youtube_url AS "youtubeUrl",
              to_char(created_at, 'YYYY-MM-DD') AS "createdAt"
    `,
    [id, type, title, content, youtubeUrl]
  );
  return rows[0];
}

export async function remove(id) {
  await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
}