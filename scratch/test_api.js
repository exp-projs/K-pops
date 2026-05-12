
const baseUrl = 'https://my-drama-list-unofficial-api-one.vercel.app';
const slug = '40257-round-six';

async function test() {
  const res = await fetch(`${baseUrl}/api/id/${slug}/photos`);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
