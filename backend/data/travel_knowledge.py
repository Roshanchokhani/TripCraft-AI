"""
Travel Knowledge Base for RAG (Retrieval-Augmented Generation).

These documents are embedded and stored in ChromaDB. When a user requests
an itinerary, semantically similar chunks are retrieved and injected into
the Gemini prompt to produce richer, more accurate recommendations.
"""

TRAVEL_DOCUMENTS = [
    # ── DESTINATION GUIDES ───────────────────────────────────────────
    {
        "id": "dest_tokyo",
        "topic": "destination",
        "content": (
            "Tokyo, Japan: Best visited in spring (March–May) for cherry blossoms or autumn "
            "(October–November) for fall foliage. The city blends ultra-modern with deeply traditional. "
            "Must-see areas: Asakusa for temples and Edo culture, Shibuya for iconic scramble crossing and youth fashion, "
            "Shinjuku for nightlife and the Golden Gai alley bars, Akihabara for electronics and anime. "
            "Day trips: Nikko (ornate shrines), Kamakura (giant Buddha), Hakone (Mt. Fuji views). "
            "Transportation: IC card (Suica/Pasmo) covers all trains and many buses. "
            "Food highlights: tsukemen ramen, fresh sushi at Tsukiji outer market, wagyu beef, conveyor-belt sushi, "
            "tempura, and standing soba noodle shops. Tipping is NOT expected and can be considered rude."
        ),
    },
    {
        "id": "dest_paris",
        "topic": "destination",
        "content": (
            "Paris, France: Best visited in spring (April–June) or early autumn (September–October). "
            "Iconic landmarks: Eiffel Tower (book tickets online to skip queues), Louvre Museum (arrive at 9 AM), "
            "Notre-Dame Cathedral (under restoration), Musée d'Orsay (Impressionist art), Sacré-Cœur in Montmartre. "
            "Neighborhoods: Le Marais (Jewish quarter, galleries, LGBTQ+ scene), Saint-Germain-des-Prés (literary cafés), "
            "Canal Saint-Martin (hipster cafés and picnics). "
            "Food: croissants from boulangeries, steak-frites bistros, macarons from Ladurée, "
            "French onion soup, croque-monsieur, escargot, and world-class cheese shops. "
            "Metro is the easiest transport. Paris Museum Pass covers 60+ museums."
        ),
    },
    {
        "id": "dest_bali",
        "topic": "destination",
        "content": (
            "Bali, Indonesia: Dry season (April–October) is best. Key regions differ in character: "
            "Seminyak for beach clubs and luxury villas, Ubud for rice terraces, yoga retreats, and art galleries, "
            "Canggu for surfer culture and digital nomads, Nusa Dua for calm family beaches. "
            "Culture: temple etiquette requires a sarong (usually lent free), remove shoes before entering temples. "
            "Highlights: Tanah Lot sea temple at sunset, Tegallalang rice terraces, Mount Batur sunrise trek, "
            "Uluwatu cliff temple with kecak fire dance. "
            "Food: nasi goreng (fried rice), babi guling (suckling pig), mie goreng, fresh coconuts everywhere. "
            "Haggling is expected in markets. Motorbike rental is the cheapest way to explore."
        ),
    },
    {
        "id": "dest_new_york",
        "topic": "destination",
        "content": (
            "New York City, USA: Vibrant year-round; spring and autumn offer the best weather. "
            "Boroughs: Manhattan (Times Square, Central Park, museums), Brooklyn (DUMBO, Williamsburg food scene), "
            "Queens (Flushing for authentic Chinese food, Astoria for Greek food). "
            "Must-do: walk the High Line, visit the 9/11 Memorial, Staten Island Ferry (free, great Statue of Liberty view), "
            "top of the Empire State Building or One World Observatory. "
            "Food: classic NYC pizza by the slice, bagels with lox and cream cheese, pastrami sandwich at Katz's Deli, "
            "dim sum in Flushing, trendy restaurants in the West Village. "
            "Transport: subway MetroCard covers all boroughs. Yellow cabs and Ubers are abundant."
        ),
    },
    {
        "id": "dest_rome",
        "topic": "destination",
        "content": (
            "Rome, Italy: Spring (April–June) and autumn (September–October) are ideal; summers are hot and crowded. "
            "Historic highlights: Colosseum and Roman Forum (book online), Vatican Museums and Sistine Chapel "
            "(reserve tickets months ahead), Pantheon (entry fee since 2023), Trevi Fountain (toss a coin!). "
            "Neighborhoods: Trastevere for authentic Roman trattorie, Campo de' Fiori for market mornings, "
            "Pigneto for local hipster scene. "
            "Food: cacio e pepe pasta, supplì (fried rice balls), thin-crust Roman pizza, gelato from artisanal shops, "
            "espresso at the bar (standing is cheaper and local). "
            "Wear comfortable shoes—cobblestones are everywhere. Dress code for churches: cover shoulders and knees."
        ),
    },
    {
        "id": "dest_barcelona",
        "topic": "destination",
        "content": (
            "Barcelona, Spain: Best April–June and September–October. The city is famous for Gaudí architecture: "
            "Sagrada Família (book weeks ahead), Park Güell, Casa Batlló, Casa Milà (La Pedrera). "
            "Neighborhoods: Gothic Quarter (narrow medieval lanes), El Born (trendy bars and the Picasso Museum), "
            "Barceloneta (beach neighborhood), Gràcia (bohemian local vibe). "
            "Food: pan con tomate (bread rubbed with tomato), jamón ibérico, patatas bravas, fresh seafood paella at the port, "
            "pintxos in El Born, late dinners (locals eat at 9–10 PM). "
            "Transport: T-Casual (10-trip metro card) is best value. Las Ramblas is touristy—keep valuables safe."
        ),
    },
    {
        "id": "dest_london",
        "topic": "destination",
        "content": (
            "London, UK: Mild year-round; June–August is warmest. Many top attractions are free: "
            "British Museum, National Gallery, Tate Modern, Natural History Museum, Victoria & Albert Museum. "
            "Paid highlights: Tower of London, Buckingham Palace State Rooms (summer only), The Shard views. "
            "Neighborhoods: Notting Hill (colorful houses, Portobello Market), Shoreditch (street art and nightlife), "
            "Borough Market (food paradise), Greenwich (Royal Observatory, maritime history). "
            "Food: full English breakfast, fish and chips, Sunday roast, afternoon tea, salt beef bagels in Brick Lane. "
            "Transport: Oyster card or contactless payment on the Tube and buses. "
            "Tip: book the Eurostar for day trips to Paris or Brussels."
        ),
    },
    {
        "id": "dest_bangkok",
        "topic": "destination",
        "content": (
            "Bangkok, Thailand: November–February is the cool, dry season—ideal for visiting. "
            "Must-see: Grand Palace and Wat Phra Kaew (dress modestly, shoulders and knees covered), "
            "Wat Pho (reclining Buddha), Wat Arun (beautiful at sunset from the river), Chatuchak Weekend Market. "
            "Neighborhoods: Silom for business and nightlife, Sukhumvit for international dining, "
            "Chinatown (Yaowarat) for street food gold. "
            "Food: pad thai, green curry, som tam (papaya salad), mango sticky rice, boat noodles at riverside stalls. "
            "Transport: BTS Skytrain and MRT Metro for key areas; tuk-tuks for short hops (negotiate price first); "
            "Chao Phraya express boats for river crossings."
        ),
    },
    {
        "id": "dest_dubai",
        "topic": "destination",
        "content": (
            "Dubai, UAE: October–April offers pleasant weather; summers are extremely hot (40°C+). "
            "Highlights: Burj Khalifa (At the Top observation deck—book ahead), Dubai Mall (world's largest mall), "
            "Gold Souk and Spice Souk in Deira, Dubai Creek abra (water taxi) ride, Palm Jumeirah views, "
            "desert safari with dune bashing and camel rides. "
            "Modern vs tradition: Downtown Dubai is ultra-modern; Al Fahidi Historic District is the old city. "
            "Food: shawarma, hummus, fresh juices, biryani, seafood at Dubai Marina. "
            "Cultural notes: dress modestly in public, no public displays of affection, alcohol is served in licensed hotels. "
            "Metro is cheap, efficient, and air-conditioned."
        ),
    },
    {
        "id": "dest_singapore",
        "topic": "destination",
        "content": (
            "Singapore: Tropical year-round (27–33°C), expect occasional rain. Incredibly safe and clean. "
            "Key attractions: Gardens by the Bay (Supertrees and Cloud Forest), Marina Bay Sands SkyPark, "
            "Sentosa Island (Universal Studios, beaches), Singapore Zoo (world-class night safari), "
            "Chinatown, Little India, and Arab Street for cultural immersion. "
            "Food: Singapore is a food paradise—hawker centres are the heart of local eating. "
            "Must try: Hainanese chicken rice, chilli crab, laksa, char kway teow, satay, roti prata. "
            "Hawker centres (Maxwell, Lau Pa Sat, Old Airport Road) are cheap and excellent. "
            "Transport: EZ-Link card for MRT (subway) and buses. Grab (local Uber) is also popular."
        ),
    },

    # ── INTEREST-BASED GUIDES ────────────────────────────────────────
    {
        "id": "guide_food_tourism",
        "topic": "interest_food",
        "content": (
            "Food Tourism Tips: To eat like a local, skip tourist-trap restaurants near major sights. "
            "Look for places where locals eat—long queues at lunch are a good sign. "
            "Street food is often safer and more authentic than cheap sit-down restaurants. "
            "Always try the signature dish of each region; ask hotel staff for their personal recommendations. "
            "Food tours are great value—guides show you local markets, explain ingredients, and navigate language barriers. "
            "Book cooking classes in advance for hands-on cultural experiences. "
            "Dietary restrictions: research phrases in the local language ('I am vegetarian', 'no pork', etc.). "
            "Explore local markets early morning when produce is freshest and vendors are most welcoming."
        ),
    },
    {
        "id": "guide_history",
        "topic": "interest_history",
        "content": (
            "History & Heritage Travel Tips: Book major historical sites online in advance to avoid long queues. "
            "Hire a local guide or use official audio guides to get the real story behind monuments. "
            "Visit popular sites early (first entry slot) or late afternoon to avoid peak crowds. "
            "Look beyond the famous landmarks—local history museums and archaeological sites often have fascinating "
            "collections with fewer tourists. "
            "Free walking tours (tip-based) are excellent for historical neighborhoods in European cities. "
            "Check if museums have free days or discounted entry for students/seniors. "
            "UNESCO World Heritage Sites provide a structured list of must-see historical locations globally."
        ),
    },
    {
        "id": "guide_adventure",
        "topic": "interest_adventure",
        "content": (
            "Adventure Travel Tips: Always book adventure activities through reputable operators with good reviews. "
            "Check safety certifications and ensure guides are qualified. Travel insurance is essential—verify it covers "
            "adventure sports like trekking, diving, and zip-lining. "
            "Acclimatize properly before high-altitude trekking (above 3000m)—spend 1–2 days adjusting. "
            "Pack layers for mountain activities; weather can change rapidly. "
            "Stay hydrated and know the symptoms of altitude sickness, heat exhaustion, and dehydration. "
            "Best adventure destinations: Nepal (Everest Base Camp trek), New Zealand (bungee jumping, skydiving), "
            "Costa Rica (zip-lining, white-water rafting), Patagonia (multi-day trekking), Bali (surfing and volcano hikes)."
        ),
    },
    {
        "id": "guide_culture",
        "topic": "interest_culture",
        "content": (
            "Cultural Immersion Tips: Learn a few basic phrases in the local language—even 'hello', 'thank you', "
            "and 'please' are warmly received. Research cultural etiquette before arriving: "
            "dress codes for religious sites, tipping customs, table manners, and greeting styles vary widely. "
            "Attend local festivals and seasonal events—check the cultural calendar before booking. "
            "Visit local art galleries, independent theatres, and community markets instead of only tourist attractions. "
            "Stay in locally owned guesthouses rather than international chains for authentic interaction. "
            "Participate in traditional crafts, music, or cooking workshops. "
            "Always ask permission before photographing people or religious ceremonies."
        ),
    },
    {
        "id": "guide_nature",
        "topic": "interest_nature",
        "content": (
            "Nature & Eco-Travel Tips: Plan nature activities around early morning or late afternoon when wildlife is most active "
            "and light is best for photography. Use reef-safe sunscreen at marine destinations. "
            "Follow Leave No Trace principles: carry out all rubbish, stay on marked trails, don't feed wildlife. "
            "Book national park entry permits in advance—popular parks have daily visitor limits. "
            "Hire local naturalist guides who know animal behavior and safe viewing distances. "
            "Best nature destinations: Galápagos Islands (unique wildlife), Costa Rica (cloud forest, turtles), "
            "Borneo (orangutans), Norwegian Fjords (midnight sun, northern lights), Amazon Rainforest, Serengeti safari."
        ),
    },

    # ── PRACTICAL TRAVEL TIPS ────────────────────────────────────────
    {
        "id": "tips_general",
        "topic": "practical",
        "content": (
            "General Travel Tips: "
            "1. Photocopy your passport and store copies separately from the original. "
            "2. Notify your bank of travel dates to avoid card blocks. "
            "3. Download Google Maps offline for your destination before you leave. "
            "4. Buy a local SIM card at the airport for cheap data. "
            "5. Use ATMs at banks rather than standalone ATMs to minimize skimming risk. "
            "6. Keep a small amount of local cash for markets, street food, and tips. "
            "7. Pack a universal power adapter and a portable charger. "
            "8. Research visa requirements at least 6 weeks before travel. "
            "9. Check travel advisories from your government's foreign affairs website. "
            "10. Book accommodation near public transport hubs to save time and money."
        ),
    },
    {
        "id": "tips_budget",
        "topic": "practical",
        "content": (
            "Budget Travel Tips: "
            "Travel in shoulder season (just before or after peak season) for lower prices and fewer crowds. "
            "Eat where locals eat—lunch specials and market food are often the best value. "
            "Use public transport instead of taxis—apps like Citymapper help navigate any city. "
            "Look for free city attractions: parks, markets, government museums, free walking tours. "
            "Book flights on Tuesdays or Wednesdays and well in advance for cheapest fares. "
            "Use Hostelworld or Booking.com's filter for private rooms in hostels—often cheaper than hotels. "
            "Cook occasionally if staying in apartments with a kitchen. "
            "City tourist cards (museum pass + public transport) are often great value for multi-day visits."
        ),
    },
    {
        "id": "tips_packing",
        "topic": "practical",
        "content": (
            "Smart Packing Tips: "
            "Pack light—a carry-on only trip saves time, baggage fees, and lost luggage stress. "
            "Roll clothes instead of folding to save space and reduce creases. "
            "Use packing cubes to organize by category (tops, bottoms, underwear). "
            "Choose versatile, neutral-colored clothes that can be mixed and matched. "
            "Pack a light rain jacket and a small packable daypack. "
            "Bring a reusable water bottle with filter for eco-friendly travel. "
            "Medication: bring more than you need, and carry a doctor's note for prescription drugs. "
            "Electronics: bring only what you'll use daily—leave extras at home."
        ),
    },
    {
        "id": "tips_safety",
        "topic": "practical",
        "content": (
            "Travel Safety Tips: "
            "Always tell someone your itinerary and check in regularly. "
            "Use a money belt or hidden pocket for passport, cash, and cards in busy areas. "
            "Be especially alert in tourist hotspots, busy markets, and on public transport—these are pickpocket zones. "
            "Avoid flashing expensive cameras, jewelry, or phones unnecessarily. "
            "Trust your instincts—if a situation feels unsafe, leave. "
            "Research common scams at your destination before arriving (common ones: fake taxis, overcharging, distraction thefts). "
            "Save the local emergency number, your country's embassy number, and your travel insurance hotline in your phone."
        ),
    },
]
