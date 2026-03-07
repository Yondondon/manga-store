import { Pool } from 'pg';

export async function seedManga(
  pool: Pool,
  authorIds: Record<string, number>,
): Promise<Record<string, number>> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`TRUNCATE TABLE manga RESTART IDENTITY CASCADE`);

    const mangaList = [
      {
        title: 'Naruto',
        authorName: 'Masashi Kishimoto',
        description:
          "Whenever Naruto Uzumaki proclaims that he will someday become the Hokage—a title bestowed upon the best ninja in the Village Hidden in the Leaves—no one takes him seriously. Since birth, Naruto has been shunned and ridiculed by his fellow villagers. But their contempt isn't because Naruto is loud-mouthed, mischievous, or because of his ineptitude in the ninja arts, but because there is a demon inside him. Prior to Naruto's birth, the powerful and deadly Nine-Tailed Fox attacked the village. In order to stop the rampage, the Fourth Hokage sacrificed his life to seal the demon inside the body of the newborn Naruto.\n" +
          '\n' +
          'And so when he is assigned to Team 7—along with his new teammates Sasuke Uchiha and Sakura Haruno, under the mentorship of veteran ninja Kakashi Hatake—Naruto is forced to work together with other people for the first time in his life. Through undergoing vigorous training and taking on challenging missions, Naruto must learn what it means to work in a team and carve his own route toward becoming a full-fledged ninja recognized by his village.',
        coverUrl: 'https://placehold.co/250x400?text=Manga&font=roboto',
      },
      {
        title: 'One Piece',
        authorName: 'Eiichiro Oda',
        description:
          'Gol D. Roger, a man referred to as the King of the Pirates, is set to be executed by the World Government. But just before his demise, he confirms the existence of a great treasure, One Piece, located somewhere within the vast ocean known as the Grand Line. Announcing that One Piece can be claimed by anyone worthy enough to reach it, the King of the Pirates is executed and the Great Age of Pirates begins.\n' +
          '\n' +
          'Twenty-two years later, a young man by the name of Monkey D. Luffy is ready to embark on his own adventure, searching for One Piece and striving to become the new King of the Pirates. Armed with just a straw hat, a small boat, and an elastic body, he sets out on a fantastic journey to gather his own crew and a worthy ship that will take them across the Grand Line to claim the greatest status on the high seas.',
        coverUrl: 'https://placehold.co/250x400?text=Manga&font=roboto',
      },
      {
        title: 'Bleach',
        authorName: 'Tite Kubo',
        description:
          "For as long as he can remember, high school student Ichigo Kurosaki has been able to see the spirits of the dead, but that has not stopped him from leading an ordinary life. One day, Ichigo returns home to find an intruder in his room who introduces herself as Rukia Kuchiki, a Soul Reaper tasked with helping souls pass over. Suddenly, the two are jolted from their conversation when a Hollow—an evil spirit known for consuming souls—attacks. As Ichigo makes a brash attempt to stop the Hollow, Rukia steps in and shields him from a counterattack. Injured and unable to keep fighting, Rukia suggests a risky plan—transfer half of her Soul Reaper powers to Ichigo. He accepts and, to Rukia's surprise, ends up absorbing her powers entirely, allowing him to easily dispatch the Hollow.\n" +
          '\n' +
          "Now a Soul Reaper himself, Ichigo must take up Rukia's duties of exterminating Hollows and protecting spirits, both living and dead. Along with his friends Orihime Inoue and Yasutora Sado—who later discover spiritual abilities of their own—Ichigo soon learns that the consequences of becoming a Soul Reaper and dealing with the world of spirits are far greater than he ever imagined.",
        coverUrl: 'https://placehold.co/250x400?text=Manga&font=roboto',
      },
      {
        title: 'Jujutsu Kaisen',
        authorName: 'Gege Akutami',
        description:
          'Hidden in plain sight, an age-old conflict rages on. Supernatural monsters known as Curses terrorize humanity from the shadows, and powerful humans known as Jujutsu sorcerers use mystical arts to exterminate them. When high school student Yuuji Itadori finds a dried-up finger of the legendary Curse Sukuna Ryoumen, he suddenly finds himself joining this bloody conflict.\n' +
          '\n' +
          "Attacked by a Curse attracted to the finger's power, Yuuji makes a reckless decision to protect himself, gaining the power to combat Curses in the process but also unwittingly unleashing the malicious Sukuna into the world once more. Though Yuuji can control and confine Sukuna to his own body, the Jujutsu world classifies Yuuji as a dangerous, high-level Curse who must be exterminated.\n" +
          '\n' +
          "Detained and sentenced to death, Yuuji meets Satoru Gojou—a teacher at Jujutsu High School—who explains that despite his imminent execution, there is an alternative for him. Being a rare vessel to Sukuna, if Yuuji were to die, then Sukuna would perish too. Therefore, if Yuuji were to consume the many other remnants of Sukuna, then Yuuji's subsequent execution would truly eradicate the malicious demon. Taking up this chance to make the world safer and live his life for a little longer, Yuuji enrolls in Tokyo Prefectural Jujutsu High School, jumping headfirst into a harsh and unforgiving battlefield.",
        coverUrl: 'https://placehold.co/250x400?text=Manga&font=roboto',
      },
      {
        title: 'Cardcaptor Sakura',
        authorName: 'CLAMP',
        description:
          "Sakura Kinomoto is an energetic and sweet 10-year-old girl attending Tomoeda Elementary School. One day not long after entering the fourth grade, Sakura finds a mysterious book titled The Clow hidden within her father's bookshelves. Upon opening it, a small, winged creature with an Osakan accent comes out of the book and introduces itself as Keroberos, the Creature of the Seal who guards magical cards known as the Clow Cards and keeps them from escaping the book.\n" +
          '\n' +
          'Unfortunately for the plushy guardian, it seems that the Clow Cards have already escaped—and now Sakura is tasked with capturing them before the cards unleash their powers and cause havoc all over Tomoeda! With the support of the tiny guardian who she nicknames "Kero" and her best friend, Tomoyo Daidouji, Sakura must wield a magical bird-shaped key and use her new powers as the Cardcaptor to maintain peace and ensure that everything is alright.',
        coverUrl: 'https://placehold.co/250x400?text=Manga&font=roboto',
      },
    ];

    const mangaIds: Record<string, number> = {};

    for (const manga of mangaList) {
      const result = await client.query<{ id: number }>(
        `INSERT INTO manga (title, author_id, description, cover_url) VALUES ($1, $2, $3, $4) RETURNING id`,
        [
          manga.title,
          authorIds[manga.authorName],
          manga.description,
          manga.coverUrl,
        ],
      );
      mangaIds[manga.title] = result.rows[0].id;
    }

    await client.query('COMMIT');
    console.log('Manga seeded');
    return mangaIds;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
