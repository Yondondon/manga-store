import { Pool } from 'pg';

export async function seedVolumes(
  pool: Pool,
  mangaIds: Record<string, number>,
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`TRUNCATE TABLE volumes RESTART IDENTITY CASCADE`);

    const volumesList = [
      {
        mangaName: 'Naruto',
        number: 1,
        price: 59.9,
        quantity: 100,
        coverUrl: 'https://placehold.co/250x400?text=Volume&font=roboto',
      },
      {
        mangaName: 'Naruto',
        number: 2,
        price: 61.9,
        quantity: 80,
        coverUrl: 'https://placehold.co/250x400?text=Volume&font=roboto',
      },
      {
        mangaName: 'Naruto',
        number: 3,
        price: 58.9,
        quantity: 50,
        coverUrl: 'https://placehold.co/250x400?text=Volume&font=roboto',
      },
      {
        mangaName: 'Bleach',
        number: 1,
        price: 60.0,
        quantity: 120,
        coverUrl: 'https://placehold.co/250x400?text=Volume&font=roboto',
      },
      {
        mangaName: 'Bleach',
        number: 2,
        price: 63.2,
        quantity: 60,
        coverUrl: 'https://placehold.co/250x400?text=Volume&font=roboto',
      },
      {
        mangaName: 'One Piece',
        number: 1,
        price: 40.1,
        quantity: 100,
        coverUrl: 'https://placehold.co/250x400?text=Volume&font=roboto',
      },
      {
        mangaName: 'Jujutsu Kaisen',
        number: 1,
        price: 53.67,
        quantity: 57,
        coverUrl: 'https://placehold.co/250x400?text=Volume&font=roboto',
      },
      {
        mangaName: 'Jujutsu Kaisen',
        number: 2,
        price: 34.63,
        quantity: 66,
        coverUrl: 'https://placehold.co/250x400?text=Volume&font=roboto',
      },
      {
        mangaName: 'Cardcaptor Sakura',
        number: 1,
        price: 65.43,
        quantity: 55,
        coverUrl: 'https://placehold.co/250x400?text=Volume&font=roboto',
      },
    ];

    for (const volume of volumesList) {
      await client.query(
        `INSERT INTO volumes (manga_id, number, price, quantity, cover_url) VALUES ($1, $2, $3, $4, $5)`,
        [
          mangaIds[volume.mangaName],
          volume.number,
          volume.price,
          volume.quantity,
          volume.coverUrl,
        ],
      );
    }

    await client.query('COMMIT');
    console.log('Volumes seeded');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
