// Mock AI responses to simulate real AI functionality
export const generateProductContent = (artisanInfo: any) => {
  // Generate more varied titles
  const titleTemplates = [
    `Handcrafted ${artisanInfo.tradition} by ${artisanInfo.name}`,
    `Traditional ${artisanInfo.material} Masterpiece`,
    `Authentic ${artisanInfo.tradition} - Heritage Collection`,
    `${artisanInfo.location} Artisan Special - ${artisanInfo.material} Craft`,
    `Exquisite ${artisanInfo.tradition} from ${artisanInfo.location}`,
    `Premium ${artisanInfo.material} ${artisanInfo.tradition}`,
    `${artisanInfo.name}'s Signature ${artisanInfo.tradition}`,
    `Artisan-Made ${artisanInfo.material} Creation`,
    `Traditional ${artisanInfo.location} ${artisanInfo.tradition}`,
    `Handmade ${artisanInfo.material} Art by ${artisanInfo.name}`
  ];

  // Generate more varied descriptions
  const descriptionTemplates = [
    `This exquisite piece represents the finest traditions of ${artisanInfo.tradition}, meticulously crafted by ${artisanInfo.name} from ${artisanInfo.location}. Using premium ${artisanInfo.material} and time-honored techniques passed down through generations, each item tells a unique story of cultural heritage and artistic mastery.`,
    
    `Created with love and expertise by ${artisanInfo.name}, this stunning example of ${artisanInfo.tradition} embodies centuries of cultural wisdom. The careful selection of ${artisanInfo.material} and traditional methods ensures each piece is not just a product, but a work of art.`,
    
    `Discover the beauty of authentic ${artisanInfo.tradition} crafted by master artisan ${artisanInfo.name} in ${artisanInfo.location}. Each piece is carefully made using traditional ${artisanInfo.material} and techniques that have been perfected over generations.`,
    
    `Experience the rich heritage of ${artisanInfo.location} through this beautiful ${artisanInfo.tradition}. ${artisanInfo.name} brings years of expertise to create this unique piece using finest quality ${artisanInfo.material}.`,
    
    `This remarkable ${artisanInfo.tradition} showcases the exceptional skill of ${artisanInfo.name}, a dedicated artisan from ${artisanInfo.location}. Crafted with premium ${artisanInfo.material}, it represents the perfect blend of tradition and artistry.`,
    
    `Handcrafted with passion by ${artisanInfo.name}, this ${artisanInfo.tradition} reflects the cultural richness of ${artisanInfo.location}. Made using traditional techniques and high-quality ${artisanInfo.material}, it's a testament to authentic craftsmanship.`
  ];

  // Generate more varied stories
  const storyTemplates = [
    `Meet ${artisanInfo.name}, a passionate guardian of ${artisanInfo.tradition} from ${artisanInfo.location}. Growing up surrounded by the ancient art of working with ${artisanInfo.material}, ${artisanInfo.name} learned these techniques from master artisans. Today, they continue this beautiful legacy, creating extraordinary pieces that bridge traditional craftsmanship and contemporary living.`,
    
    `${artisanInfo.name}'s journey began in the workshops of ${artisanInfo.location}, where ${artisanInfo.tradition} has flourished for generations. Learning from elder artisans, ${artisanInfo.name} discovered that true craftsmanship is about infusing each piece with cultural memory and personal devotion.`,
    
    `Born into a family of artisans in ${artisanInfo.location}, ${artisanInfo.name} has been practicing ${artisanInfo.tradition} for over two decades. Their expertise with ${artisanInfo.material} has been honed through years of dedication and respect for traditional methods.`,
    
    `${artisanInfo.name} represents the new generation of artisans keeping ${artisanInfo.tradition} alive in ${artisanInfo.location}. With deep respect for ancestral techniques and innovative approaches to working with ${artisanInfo.material}, they create pieces that honor the past while embracing the future.`,
    
    `From the heart of ${artisanInfo.location}, ${artisanInfo.name} brings the ancient art of ${artisanInfo.tradition} to life. Their mastery over ${artisanInfo.material} and commitment to preserving cultural heritage makes each creation a unique masterpiece.`
  ];

  // Add randomization to ensure different content each time
  const randomTitle = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
  const randomDescription = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)];
  const randomStory = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now();
  const uniqueKeywords = ['handmade', 'traditional', 'authentic', 'heritage', 'artisan', 'indian-craft', 'sustainable', 'unique', `craft-${timestamp}`];

  return {
    title: randomTitle,
    description: randomDescription,
    story: randomStory,
    keywords: uniqueKeywords,
    marketing: {
      instagram: `✨ Discover authentic craftsmanship ✨\n\n${artisanInfo.tradition} by ${artisanInfo.name} from ${artisanInfo.location} 🏺\n\nCrafted with premium ${artisanInfo.material} using traditional techniques 💝\n\n#HandmadeInIndia #AuthenticCrafts #ArtisanMade #TraditionalCrafts #Heritage #Handcrafted`,
      
      whatsapp: `🌟 *Handcrafted Collection* 🌟\n\nAuthentic ${artisanInfo.tradition} by ${artisanInfo.name} from ${artisanInfo.location}\n\n✅ 100% Handmade\n✅ Premium ${artisanInfo.material}\n✅ Traditional Techniques\n\nLimited quantities available! 🏺`
    }
  };
};

export const generateMarketingContent = (platform: string, productId: string) => {
  const platformContent = {
    instagram: {
      caption: `✨ Handcrafted with love and tradition ✨

This stunning piece represents generations of artistic mastery from the heart of India. Each detail tells a story of cultural heritage and passionate craftsmanship.

🏺 Traditional techniques meet modern aesthetics
🌿 Sustainably crafted with natural materials  
💝 Made with love by skilled artisans
🌍 Bringing authentic Indian art to your home`,
      hashtags: ['#HandmadeInIndia', '#AuthenticCrafts', '#ArtisanMade', '#IndianHeritage', '#TraditionalArt', '#SustainableLiving', '#CulturalTreasures', '#HandcraftedBeauty', '#IndigenousArt', '#ArtisanSupport'],
      cta: 'Shop now and support traditional artisans! Link in bio 🛍️'
    },
    facebook: {
      caption: `Discover the Beauty of Authentic Indian Craftsmanship

Step into a world where every piece tells a story of tradition, skill, and cultural pride. Our artisans pour their hearts into creating these magnificent works of art, using techniques that have been passed down through generations.

When you choose handcrafted products, you're not just buying an item – you're supporting:
• Traditional artisan communities
• Sustainable crafting practices  
• Cultural preservation
• Fair trade and ethical commerce

Each purchase helps preserve these beautiful traditions for future generations while bringing authentic Indian artistry into your home.`,
      hashtags: ['#HandmadeIndia', '#ArtisanCrafts', '#CulturalHeritage', '#SustainableShopping', '#TraditionalArt', '#EthicalCommerce'],
      cta: 'Explore our collection and support artisan communities today!'
    },
    whatsapp: {
      caption: `🌟 *EXCLUSIVE ARTISAN COLLECTION* 🌟

✨ Authentic handcrafted treasures from India's master artisans
🏺 Traditional techniques, premium materials
🌿 100% sustainable and ethically made
💝 Each piece tells a unique cultural story

*Special Launch Offer - Limited Time!*

Perfect for:
✅ Home decoration
✅ Thoughtful gifts
✅ Cultural enthusiasts
✅ Sustainable living

*WhatsApp us for exclusive previews and custom orders!*`,
      hashtags: ['#HandmadeIndia', '#ArtisanCrafts', '#AuthenticIndian', '#CulturalArt', '#SustainableLiving'],
      cta: 'Message us for instant catalog and special pricing! 📱'
    }
  };

  return platformContent[platform as keyof typeof platformContent] || platformContent.instagram;
};