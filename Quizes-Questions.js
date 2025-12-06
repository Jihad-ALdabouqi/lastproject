
const quizzes = {
  english: [
    { q: "What is the past tense of 'go'?", options: ["goed", "went", "gone", "goes"], answer: 1 },
    { q: "Which is a proper noun?", options: ["city", "river", "London", "book"], answer: 2 },
    { q: "Choose the correct sentence:", options: ["She don't like apples.", "She doesn't likes apples.", "She doesn't like apples.", "She not like apples."], answer: 2 },
    { q: "What is the plural of 'child'?", options: ["childs", "children", "childes", "child's"], answer: 1 },
    { q: "Which word is an adjective?", options: ["quickly", "run", "happy", "jump"], answer: 2 },
    { q: "Identify the preposition:", options: ["and", "but", "under", "they"], answer: 2 },
    { q: "'He ___ to school every day.'", options: ["go", "goes", "going", "gone"], answer: 1 },
    { q: "Which is a synonym for 'happy'?", options: ["sad", "angry", "joyful", "tired"], answer: 2 },
    { q: "What is the subject in: 'The cat sleeps.'?", options: ["cat", "sleeps", "the", "The cat"], answer: 3 },
    { q: "Which sentence is in passive voice?", options: ["She wrote a letter.", "A letter was written by her.", "She writes letters.", "Letters are writing."], answer: 1 }
  ],
  french: [
    { q: "Comment dit-on 'hello' en français ?", options: ["Bonjour", "Merci", "Au revoir", "S'il vous plaît"], answer: 0 },
    { q: "Quel mot signifie 'book' ?", options: ["livre", "stylo", "table", "chaise"], answer: 0 },
    { q: "'Je ___ étudiant.'", options: ["suis", "es", "est", "sommes"], answer: 0 },
    { q: "Quel article est masculin ?", options: ["la", "les", "le", "des"], answer: 2 },
    { q: "Traduisez: 'I love you'", options: ["Je t'aime", "Je m'appelle", "Je vais bien", "Je suis fatigué"], answer: 0 },
    { q: "Quel verbe est irrégulier ?", options: ["parler", "finir", "aller", "manger"], answer: 2 },
    { q: "Combien font 'deux + trois' ?", options: ["quatre", "cinq", "six", "sept"], answer: 1 },
    { q: "Où est Paris ?", options: ["en Espagne", "en Italie", "en France", "en Allemagne"], answer: 2 },
    { q: "'Elle ___ une pomme.'", options: ["mange", "manges", "manger", "mangent"], answer: 0 },
    { q: "Quel mot est féminin ?", options: ["livre", "stylo", "table", "mur"], answer: 2 }
  ],
  spanish: [
    { q: "¿Cómo se dice 'good morning'?", options: ["Buenas noches", "Buenos días", "Hola", "Adiós"], answer: 1 },
    { q: "¿Qué significa 'gracias'?", options: ["please", "sorry", "thank you", "hello"], answer: 2 },
    { q: "'Yo ___ estudiante.'", options: ["soy", "eres", "es", "somos"], answer: 0 },
    { q: "¿Cuál es el plural de 'libro'?", options: ["libros", "librae", "libres", "libri"], answer: 0 },
    { q: "¿Dónde está Madrid?", options: ["en Francia", "en Italia", "en España", "en Portugal"], answer: 2 },
    { q: "Elige el verbo: 'comer', 'rápido', 'alto', 'ayer'", options: ["comer", "rápido", "alto", "ayer"], answer: 0 },
    { q: "'Él ___ a la escuela.'", options: ["va", "vas", "voy", "van"], answer: 0 },
    { q: "¿Qué palabra es masculina?", options: ["mesa", "silla", "libro", "casa"], answer: 2 },
    { q: "Dos + dos =", options: ["tres", "cuatro", "cinco", "seis"], answer: 1 },
    { q: "¿Cuál es un adjetivo?", options: ["correr", "feliz", "ayer", "yo"], answer: 1 }
  ],
  arabic: [
    { q: "ما هو اسم العلم من بين هذه الكلمات؟", options: ["مدينة", "نهر", "عمّان", "كتاب"], answer: 2 },
    { q: "ما المفرد من 'كتب'؟", options: ["كِتاب", "كُتُب", "كُتاب", "مكتبة"], answer: 0 },
    { q: "'الطفل ___ في الحديقة.' — ما الفعل الصحيح؟", options: ["يلعب", "يلعبون", "تلعب", "يلعبان"], answer: 0 },
    { q: "أي جملة صحيحة؟", options: ["الولد يذهب المدرسة", "الولد يذهب إلى المدرسة", "الولد يذهبان المدرسة", "الولد يذهبون المدرسة"], answer: 1 },
    { q: "ما اسم الفاعل في الجملة: 'قرأتُ الكتاب'؟", options: ["الكتاب", "قرأت", "أنا", "المدرسة"], answer: 2 },
    { q: "ما علامة رفع الاسم المفرد؟", options: ["الضمة", "الفتحة", "الكسرة", "السكون"], answer: 0 },
    { q: "أي كلمة من الجذر 'ك-ت-ب'؟", options: ["مدرسة", "مكتب", "بيت", "شجرة"], answer: 1 },
    { q: "'الطالبات ___ الامتحان.' — ما الفعل المناسب؟", options: ["يكتبن", "يكتب", "تكتب", "يكتُبْن"], answer: 3 },
    { q: "ما المفعول به في: 'أحبُّ العلمَ'؟", options: ["أحب", "أنا", "العلم", "الحب"], answer: 2 },
    { q: "أي جملة في المبني للمجهول؟", options: ["كتب الولد الدرس", "كُتِب الدرسُ من الولد", "الولد كاتب", "الدرس مكتوب"], answer: 1 }
  ],
  turkish: [
    { q: "'Merhaba' ne demek?", options: ["Güle güle", "Teşekkür ederim", "Merhaba", "Evet"], answer: 2 },
    { q: "Hangisi 'kitap' demektir?", options: ["masa", "sandalye", "kitap", "kalem"], answer: 2 },
    { q: "'Ben ___ öğrenciyim.'", options: ["bir", "sen", "o", "biz"], answer: 0 },
    { q: "Hangi kelime fiildir?", options: ["güzel", "koşmak", "ev", "büyük"], answer: 1 },
    { q: "'Sen ___ okula gidersin.'", options: ["her gün", "dün", "yarın", "şimdi"], answer: 0 },
    { q: "Ankara nerededir?", options: ["Almanya", "Fransa", "Türkiye", "İspanya"], answer: 2 },
    { q: "Plural hali: 'çocuk'", options: ["çocuklar", "çocuklarım", "çocuğum", "çocukları"], answer: 0 },
    { q: "Hangisi ünlüdür?", options: ["k", "t", "a", "p"], answer: 2 },
    { q: "'Ben kitap ___.' — doğru eylem?", options: ["okurum", "okursun", "okur", "okuruz"], answer: 0 },
    { q: "Hangisi özel isimdir?", options: ["şehir", "nehir", "İstanbul", "dağ"], answer: 2 }
  ],
  chinese: [
    { q: "“你好” (nǐ hǎo) ne demek?", options: ["Hoşça kal", "Teşekkürler", "Merhaba", "Evet"], answer: 2 },
    { q: "“书” (shū) ne demek?", options: ["masa", "sandalye", "kitap", "kalem"], answer: 2 },
    { q: "Hangisi sayıdır: 三 (sān)?", options: ["1", "2", "3", "4"], answer: 2 },
    { q: "“北京” (Běijīng) nerededir?", options: ["Japonya", "Güney Kore", "Çin", "Tayvan"], answer: 2 },
    { q: "Hangisi “ben” demektir?", options: ["你 (nǐ)", "他 (tā)", "我 (wǒ)", "们 (men)"], answer: 2 },
    { q: "“谢谢” (xièxie) ne demek?", options: ["Merhaba", "Hoşça kal", "Teşekkür ederim", "Üzgünüm"], answer: 2 },
    { q: "Hangisi fiildir: “吃” (chī)?", options: ["yemek", "yemek yemek", "su", "insan"], answer: 1 },
    { q: "“妈妈” (māma) kim?", options: ["Baba", "Anne", "Kardeş", "Dost"], answer: 1 },
    { q: "Hangisi renk: 红 (hóng)?", options: ["Mavi", "Yeşil", "Kırmızı", "Siyah"], answer: 2 },
    { q: "“不” (bù) ne işe yarar?", options: ["evet", "hayır", "olumsuzluk", "soru"], answer: 2 }
  ]
}
