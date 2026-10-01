import Page from '../models/Page.js';

export const seedDefaultCmsPages = async () => {
  try {
    const pagesToSeed = [
      {
        slug: 'home',
        title: 'Home — TEJOVA',
        subtitle: 'Expand Your Light. Sovereign Performance Living.',
        hero: {
          title: 'Master Your Sovereignty. Unleash Your Vitality.',
          subtitle: 'TEJOVA — VITALITY PROTOCOL',
          description: 'Integrate the four essential pillars—Yoga, Breath, Health, and Fitness—for a definitive performance protocol built for longevity. Move beyond "not being sick" to a state of peak-impact vitality. Discover the Sovereign Body and rule your life.',
          mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Sovereign Living Hero',
          ctaText: 'Begin Your Journey →',
          ctaLink: '/vitality'
        },
        sections: [
          {
            sectionId: 'sec_entry_sequence',
            type: 'entry_sequence',
            title: 'Entry Sequence Words',
            subtitle: 'Conscious Living',
            items: [
              {
                id: 'seq_1',
                title: 'TEJOVA',
                kicker: 'ORIGIN & RADIANCE',
                subtitle: 'Sovereign Command',
                description: 'The expansion of innate physical and mental radiance.',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
                order: 0,
                isVisible: true
              },
              {
                id: 'seq_2',
                title: 'Vitality',
                kicker: 'PILLAR 01',
                subtitle: 'Peak-Impact Energy',
                description: 'Mastery of Yoga, Breath, and biological heat.',
                image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200',
                order: 1,
                isVisible: true
              },
              {
                id: 'seq_3',
                title: 'Nourishment',
                kicker: 'PILLAR 02',
                subtitle: 'Cellular Restoration',
                description: 'Conscious nutrition and pure biological formulations.',
                image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200',
                order: 2,
                isVisible: true
              },
              {
                id: 'seq_4',
                title: 'Lifestyle',
                kicker: 'PILLAR 03',
                subtitle: 'Conscious Habits',
                description: 'Grounding rituals and sovereign daily routine.',
                image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200',
                order: 3,
                isVisible: true
              },
              {
                id: 'seq_5',
                title: 'Longevity',
                kicker: 'PILLAR 04',
                subtitle: 'Sovereign Future',
                description: 'Cellular protection and enduring biological vigor.',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
                order: 4,
                isVisible: true
              },
              {
                id: 'seq_6',
                title: 'Expand Your Light',
                kicker: 'SOVEREIGN PURPOSE',
                subtitle: 'Rule Your Life',
                description: 'Move beyond surviving into peak physical and mental sovereignty.',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
                order: 5,
                isVisible: true
              }
            ],
            order: 0,
            isVisible: true
          },
          {
            sectionId: 'sec_brand_philosophy',
            type: 'brand_philosophy',
            title: 'Beyond Wellness. A Sovereign Lifestyle.',
            subtitle: 'BRAND PHILOSOPHY',
            kicker: 'TEJOVA PROTOCOL',
            content: '<p>TEJOVA is a premium performance protocol dedicated to engineering your ultimate state of being. We unite ancient yogic wisdom with modern biological science to elevate your daily existence through our four core pillars: Vitality, Nourishment, Lifestyle, and Longevity.</p><p>We believe true luxury is a highly functioning body and a calm, commanding mind. By integrating conscious daily habits and pure, natural nourishment, we help you reclaim your life force and thrive from within.</p>',
            badge: 'PEAK VITALITY',
            media: {
              url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800',
              resourceType: 'image',
              alt: 'Brand Philosophy Image'
            },
            cta: {
              text: 'Discover Our Protocol →',
              url: '/vitality',
              variant: 'primary'
            },
            settings: {
              backgroundColor: '#FAF8F5',
              textColor: '#1F2937'
            },
            order: 0,
            isVisible: true
          },
          {
            sectionId: 'sec_brand_story',
            type: 'brand_story',
            title: 'We Believe Peak Vitality Should Build Your Life, Not Cost It.',
            subtitle: 'OUR BRAND STORY',
            content: '<p>Tejova promises a higher standard of existence where longevity is built into your daily operations. By integrating Vitality, Nourishment, Lifestyle and Longevity, we move you beyond merely surviving to achieve peak-impact vitality. Reclaim your Prana and start ruling your life.</p>',
            media: {
              url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
              resourceType: 'image',
              alt: 'Brand Story Image'
            },
            order: 1,
            isVisible: true
          },
          {
            sectionId: 'sec_philosophy',
            type: 'philosophy',
            title: 'Expand Your Light',
            subtitle: 'THE PHILOSOPHY',
            content: '<p>"Tej" in ancient Sanskrit represents inner radiance, biological brilliance, and vital heat. "Ova" signifies origin and continuous growth. Together, TEJOVA embodies the expansion of your innate physical and mental vitality.</p><p>Every protocol we design, every formulation we recommend, and every ritual we share is engineered to nurture your life force. We are here to help you achieve a state of peak-impact performance—so you can show up fully for yourself, your family, and your life\'s work.</p>',
            items: [
              {
                id: 'item_p1',
                title: 'Vitality & Longevity',
                description: 'Designing a higher standard of existence where optimal longevity is built directly into your daily operations.',
                order: 0,
                isVisible: true
              },
              {
                id: 'item_p2',
                title: 'Pure Nourishment',
                description: 'Dietary protocols and natural insights crafted to complement natural biological laws and restore your Prana.',
                order: 1,
                isVisible: true
              },
              {
                id: 'item_p3',
                title: 'Sovereign Lifestyle',
                description: 'Elevating everyday routines through Yoga, Breath, Health, and Fitness to move you beyond merely surviving into ruling your life.',
                order: 2,
                isVisible: true
              }
            ],
            order: 2,
            isVisible: true
          },
          {
            sectionId: 'sec_four_pillars',
            type: 'four_pillars',
            title: 'Built Upon Four Pillars',
            subtitle: 'A COMPLETE APPROACH',
            content: 'We view wellbeing through four interconnected dimensions that work together to create a vibrant life.',
            items: [
              {
                id: 'pil_vitality',
                kicker: 'PILLAR 01',
                title: 'Vitality',
                subtitle: 'Peak-Impact Energy. Sovereign Living.',
                description: 'Move beyond simply surviving your day to a state of peak-impact performance. By integrating mindful yoga and conscious breathwork into your daily operations, you will electrify your life force. Vitality is the foundation of your Sovereign Body.',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
                link: '/vitality',
                order: 0,
                isVisible: true
              },
              {
                id: 'pil_nourishment',
                kicker: 'PILLAR 02',
                title: 'Nourishment',
                subtitle: 'Real Food. Lasting Health.',
                description: 'Conscious nutrition and pure, natural formulations fuel your highest potential. Align with natural biological laws to restore your Prana and engineer ultimate cellular longevity.',
                image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600',
                link: '/nourishment',
                order: 1,
                isVisible: true
              },
              {
                id: 'pil_lifestyle',
                kicker: 'PILLAR 03',
                title: 'Lifestyle',
                subtitle: 'Conscious Habits. Sovereign Mind.',
                description: 'Integrate grounding rituals, restorative rest, and natural rhythms into your daily operations. Cultivate a calm, commanding mind to stop surviving and start ruling your life.',
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
                link: '/lifestyle',
                order: 2,
                isVisible: true
              },
              {
                id: 'pil_longevity',
                kicker: 'PILLAR 04',
                title: 'Longevity',
                subtitle: 'Longer Life. Deeper Wellbeing.',
                description: 'Protect your cellular health, restore quiet mind spaces, and nurture your spirit for a longer, happier life rooted in inner balance.',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600',
                link: '/longevity',
                order: 3,
                isVisible: true
              }
            ],
            order: 3,
            isVisible: true
          }
        ],
        isPublished: true
      },
      {
        slug: 'vitality',
        title: 'Vitality — TEJOVA',
        subtitle: 'Pure Prana. Sovereign Command.',
        hero: {
          title: 'Pure Prana. Sovereign Command.',
          subtitle: 'VITALITY PROTOCOL',
          description: 'Our protocol restores your bio-energetic alignment through the mastery of Yoga, Breath, Health, and Fitness. By integrating these four pillars into your daily operations, we empower you to reclaim your intrinsic Prana and achieve a state of peak-impact vitality.',
          mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Vitality Hero Image',
          ctaText: 'Explore Vitality Protocol →',
          ctaLink: '#daily-protocols'
        },
        sections: [
          {
            sectionId: 'sec_vitality_protocols',
            type: 'protocol_cards',
            title: 'Sovereign Rituals',
            subtitle: 'Daily routines to restore your bio-energetic alignment and command your vitality.',
            kicker: 'DAILY PROTOCOLS',
            items: [
              {
                id: 'prot_1',
                kicker: '20 MINS',
                tag: 'Yoga',
                title: 'Sovereign Asana & Alignment',
                description: 'Cultivate continuous physical growth and vital heat through 12 dynamic cycles of Surya Namaskar.',
                image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600',
                order: 0,
                isVisible: true
              },
              {
                id: 'prot_2',
                kicker: '10 MINS',
                tag: 'Breath',
                title: 'Sovereign Box Breathing',
                description: 'Command your nervous system using a precise 4-4-4-4 rhythm: inhale, hold, exhale, and hold for four seconds each. This rhythmic Prana control instantly neutralizes stress and engineers peak-impact mental clarity.',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
                order: 1,
                isVisible: true
              },
              {
                id: 'prot_3',
                kicker: 'DAILY',
                tag: 'Health',
                title: 'Conscious Alignment & Recovery',
                description: 'Honor your biology through mindful, awareness-based eating and daily grounding practices like earthing. Conclude your operations with a restorative night shower for deep cellular repair.',
                image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
                order: 2,
                isVisible: true
              },
              {
                id: 'prot_4',
                kicker: '30 MINS',
                tag: 'Fitness',
                title: 'Functional Peak Resistance',
                description: 'Engineer your physical endurance with 30 minutes of focused daily resistance training at home or gym. Build the structural resilience and cardiovascular power required to fully rule your life and your body.',
                image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
                order: 3,
                isVisible: true
              }
            ],
            order: 0,
            isVisible: true
          }
        ],
        isPublished: true
      },
      {
        slug: 'nourishment',
        title: 'Nourishment — TEJOVA',
        subtitle: 'Conscious Fuel. Cellular Command.',
        hero: {
          title: 'Conscious Fuel. Cellular Command.',
          subtitle: 'NOURISHMENT PROTOCOL',
          description: 'Nourishment is the intentional mastery of your biological ecosystem. Through plant-aligned dietary protocols and mindful eating rhythms, we eliminate systemic inflammation, heal the gut, and fuel your body for peak-impact performance.',
          mediaUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Nourishment Hero Image',
          ctaText: 'Explore Nourishment Protocol →',
          ctaLink: '#nourishment-ethos'
        },
        sections: [
          {
            sectionId: 'sec_nourishment_quote',
            type: 'quote',
            title: 'The Nourishment Ethos',
            content: '"Nourishment is not merely calories in a bowl; it is an active dialogue with your microbiome and cellular health. Align with natural biological laws to restore your Prana and engineer ultimate cellular longevity."',
            badge: 'TEJOVA LIFE',
            order: 0,
            isVisible: true
          },
          {
            sectionId: 'sec_elemental_nourishment',
            type: 'cards',
            title: 'The 4 Pillars of Elemental Nourishment',
            subtitle: 'BIOLOGICAL FOUNDATION',
            content: 'A comprehensive system of biological optimization through intentional, plant-aligned nutrient and energy synergy.',
            items: [
              {
                id: 'elem_1',
                title: 'Water: Fluid Intelligence',
                description: 'The master conductor of electrical signals. Optimize your deep cellular hydration to ensure seamless, instantaneous bio-energetic communication across all biological systems.',
                order: 0,
                isVisible: true
              },
              {
                id: 'elem_2',
                title: 'Earth: Natural Food',
                description: 'Pure biological information from the soil. Fuel your physical architecture with plant-aligned, unrefined whole foods and seeds to forge absolute structural resilience.',
                order: 1,
                isVisible: true
              },
              {
                id: 'elem_3',
                title: 'Fire: Sunlight',
                description: 'The original source of cellular power. Absorb vital photonic energy to drive metabolic output, optimize hormonal balance, and anchor your circadian alignment.',
                order: 2,
                isVisible: true
              },
              {
                id: 'elem_4',
                title: 'Air / Ether: Cosmic Energy',
                description: 'The subtle nourishment of Prana. Command the invisible, potent life force that bridges the gap between physical endurance and peak-impact mental sovereignty.',
                order: 3,
                isVisible: true
              }
            ],
            order: 1,
            isVisible: true
          }
        ],
        isPublished: true
      },
      {
        slug: 'lifestyle',
        title: 'Lifestyle — TEJOVA',
        subtitle: 'Conscious Habits. Sovereign Mind.',
        hero: {
          title: 'Conscious Habits. Sovereign Mind.',
          subtitle: 'PILLAR 03 — LIFESTYLE',
          description: 'Integrate grounding rituals, restorative rest, and natural rhythms into your daily operations. Cultivate a calm, commanding mind to stop surviving and start ruling your life.',
          mediaUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Lifestyle Hero Image',
          ctaText: 'Explore Lifestyle Protocol →',
          ctaLink: '#lifestyle-content'
        },
        sections: [
          {
            sectionId: 'sec_lifestyle_body',
            type: 'rich_content',
            title: 'Mindful Architecture for Daily Operations',
            content: '<p>Live with intention. Cultivate mindfulness, nurture mental clarity, and unlock your potential through daily rituals aligned with natural rhythms.</p><p>By structuring your daily operations around natural light, deliberate focus windows, and restorative sleep protocols, your mind gains unbreakable resilience.</p>',
            order: 0,
            isVisible: true
          }
        ],
        isPublished: true
      },
      {
        slug: 'longevity',
        title: 'Longevity — TEJOVA',
        subtitle: 'Longer Life. Deeper Wellbeing.',
        hero: {
          title: 'Longer Life. Deeper Wellbeing.',
          subtitle: 'PILLAR 04 — LONGEVITY',
          description: 'Protect your cellular health, restore quiet mind spaces, and nurture your spirit for a longer, happier life rooted in inner balance.',
          mediaUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image',
          alt: 'Longevity Hero Image',
          ctaText: 'Explore Longevity →',
          ctaLink: '#longevity-content'
        },
        sections: [
          {
            sectionId: 'sec_longevity_body',
            type: 'rich_content',
            title: 'Cellular Restoration & Bio-Energetic Resilience',
            content: '<p>Longevity is not merely adding years to your life, but adding vital life to your years. We focus on mitochondrial vitality, DNA integrity, and systemic anti-inflammatory protocols.</p>',
            order: 0,
            isVisible: true
          }
        ],
        isPublished: true
      },
      {
        slug: 'about',
        title: 'About Us — TEJOVA',
        subtitle: 'Reclaiming Prana. Ruling Your Life.',
        hero: {
          title: 'Expand Your Light. Rule Your Life.',
          subtitle: 'ABOUT TEJOVA',
          description: 'TEJOVA is a sovereign performance brand engineered to bridge ancient biological wisdom and high-stakes performance living.',
          mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image'
        },
        sections: [],
        isPublished: true
      },
      {
        slug: 'contact',
        title: 'Contact Us — TEJOVA',
        subtitle: 'Connect with the TEJOVA Protocol Team.',
        hero: {
          title: 'Connect With Our Sovereign Team',
          subtitle: 'CONTACT TEJOVA',
          description: 'Have questions about our bio-energetic protocols or advisory services? We are here to support your journey.',
          mediaUrl: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image'
        },
        sections: [],
        isPublished: true
      },
      {
        slug: 'blog',
        title: 'Blog — TEJOVA',
        subtitle: 'Insights & Editorial Journal',
        hero: {
          title: 'The Sovereign Journal',
          subtitle: 'EDITORIAL & INSIGHTS',
          description: 'Explore research on bio-energetic alignment, adaptogenic science, and performance living.',
          mediaUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image'
        },
        sections: [
          {
            sectionId: 'sec_blog_entry_photos',
            type: 'blog_entry_photos',
            title: 'Four Entry Photos (Slow Animation)',
            subtitle: 'FEATURED VISUAL GALLERY',
            items: [
              {
                id: 'photo_1',
                title: 'Mindful Outdoor Meditation',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
                order: 0,
                isVisible: true
              },
              {
                id: 'photo_2',
                title: 'Conscious Harvest & Whole Foods',
                image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600',
                order: 1,
                isVisible: true
              },
              {
                id: 'photo_3',
                title: 'Sunset Alignment & Serenity',
                image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
                order: 2,
                isVisible: true
              },
              {
                id: 'photo_4',
                title: 'Deep Nature Roots & Tree Canopy',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600',
                order: 3,
                isVisible: true
              }
            ],
            order: 0,
            isVisible: true
          }
        ],
        isPublished: true
      },
      {
        slug: 'journal',
        title: 'Journal — TEJOVA',
        subtitle: 'Insights & Editorial Journal',
        hero: {
          title: 'The Sovereign Journal',
          subtitle: 'EDITORIAL & INSIGHTS',
          description: 'Explore research on bio-energetic alignment, adaptogenic science, and performance living.',
          mediaUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200',
          resourceType: 'image'
        },
        sections: [
          {
            sectionId: 'sec_blog_entry_photos',
            type: 'blog_entry_photos',
            title: 'Four Entry Photos (Slow Animation)',
            subtitle: 'FEATURED VISUAL GALLERY',
            items: [
              {
                id: 'photo_1',
                title: 'Mindful Outdoor Meditation',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
                order: 0,
                isVisible: true
              },
              {
                id: 'photo_2',
                title: 'Conscious Harvest & Whole Foods',
                image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600',
                order: 1,
                isVisible: true
              },
              {
                id: 'photo_3',
                title: 'Sunset Alignment & Serenity',
                image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
                order: 2,
                isVisible: true
              },
              {
                id: 'photo_4',
                title: 'Deep Nature Roots & Tree Canopy',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600',
                order: 3,
                isVisible: true
              }
            ],
            order: 0,
            isVisible: true
          }
        ],
        isPublished: true
      }
    ];

    for (const pageData of pagesToSeed) {
      await Page.findOneAndUpdate(
        { slug: pageData.slug },
        pageData,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Default CMS Pages seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding default CMS pages:', error.message);
  }
};

