const axios = require('axios');
const fs = require('fs');

const RANDOMMER_API_KEY = "b6ce01fad9b744baaced2db5088fedc6";
const headers = { "X-Api-Key": RANDOMMER_API_KEY };

// https://randomuser.me/api/
async function getRandomUser() {
  const res = await axios.get("https://randomuser.me/api/?nat=fr");
  const user = res.data.results[0];
  return {
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    gender: user.gender,
    location: `${user.location.city}, ${user.location.country}`,
    picture: user.picture.large
  };
}

// https://randommer.io/api/Phone/Generate?CountryCode=FR&Quantity=1
async function getPhoneNumber() {
  const res = await axios.get(
    "https://randommer.io/api/Phone/Generate?CountryCode=FR&Quantity=1",
    { headers }
  );
  return Array.isArray(res.data) ? res.data[0] : res.data;
}

// https://randommer.io/api/Finance/Iban/FR"
async function getIban() {
  const res = await axios.get("https://randommer.io/api/Finance/Iban/FR", {
    headers
  });
  return res.data;
}

// https://randommer.io/api/Card
async function getCreditCard() {
  const res = await axios.get("https://randommer.io/api/Card", { headers });
  return {
    card_number: res.data.cardNumber,
    card_type: res.data.cardType || "VISA",
    expiration_date: res.data.expiration || "12/2026",
    cvv: res.data.cvv
  };
}

// https://randommer.io/api/Name?nameType=firstname&quantity=1
async function getRandomName() {
  const res = await axios.get(
    "https://randommer.io/api/Name?nameType=firstname&quantity=1",
    { headers }
  );
  return Array.isArray(res.data) ? res.data[0] : res.data;
}

// https://catfact.ninja/fact
async function getAnimal() {
  const res = await axios.get("https://catfact.ninja/fact");
  return "Cat : " + res.data.fact;
}

// https://zenquotes.io/api/random
async function getQuote() {
  const res = await axios.get("https://zenquotes.io/api/random");
  const quote = res.data[0];
  return {
    content: quote.q,
    author: quote.a
  };
}

// https://v2.jokeapi.dev/joke/Programming?type=single
async function getJoke() {
  const res = await axios.get(
    "https://v2.jokeapi.dev/joke/Programming?type=single"
  );
  return {
    type: res.data.category,
    content: res.data.joke
  };
}

// --- Fonction d'enregistrement ---
function saveToJsonFile(data, filename = "profile.json") {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(` Profil sauvegardé dans ${filename}`);
}

// --- Pipeline complet ---
async function generateUserProfile() {
  try {
    const user = await getRandomUser();
    console.log("Random User OK");

    const phone = await getPhoneNumber();
    console.log("Phone OK:", phone);

    const iban = await getIban();
    console.log("IBAN OK:", iban);

    const creditCard = await getCreditCard();
    console.log("Credit Card OK:", creditCard.card_number);

    const randomName = await getRandomName();
    console.log("Random Name OK:", randomName);

    const pet = await getAnimal();
    console.log("Pet OK");

    const quote = await getQuote();
    console.log("Quote OK");

    const joke = await getJoke();
    console.log("Joke OK");

    const profile = {
      user,
      phone_number: phone,
      iban,
      credit_card: creditCard,
      random_name: randomName,
      pet,
      quote,
      joke
    };

    console.log("\n--- PROFILE FINAL ---");
    console.log(JSON.stringify(profile, null, 2));

    saveToJsonFile(profile);
  } catch (error) {
    console.error("ERREUR lors d'un appel API.");
    if (error.config) {
      console.error("URL :", error.config.url);
      console.error("Method :", error.config.method);
    }
    if (error.response) {
      console.error("Status :", error.response.status);
      console.error("Body :", error.response.data);
    } else {
      console.error("Message :", error.message);
    }
  }
}

// Lancer le pipeline
generateUserProfile();
