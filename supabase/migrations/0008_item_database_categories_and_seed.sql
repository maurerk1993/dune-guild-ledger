alter table public.item_recipes
  add column if not exists item_category text not null default 'Uncategorized';

create index if not exists item_recipes_category_idx
  on public.item_recipes (item_category);

do $$
declare
  actor_id uuid;
begin
  select id into actor_id from public.profiles order by created_at asc limit 1;

  if actor_id is null then
    raise notice 'Skipping Windrose seed import because no profile exists yet.';
    return;
  end if;

  insert into public.item_recipes (item_name, item_category, crafting_recipe, notes, created_by, updated_by)
  values
    ('Alchemy Table', 'Buildings & Structures', 'Crafting Station (Wood)', 'Primary station for potions and elixirs.', actor_id, actor_id),
    ('Cooking Fire', 'Buildings & Structures', 'Crafting Station (Wood)', 'Used for advanced meals and long-duration buffs.', actor_id, actor_id),
    ('Charcoal Kiln', 'Buildings & Structures', 'Crafting Station (Clay)', 'Processes wood into charcoal, ash, and tar.', actor_id, actor_id),
    ('Smelting Furnace', 'Buildings & Structures', 'Crafting Station (Clay)', 'Smelts Copper, Iron, Gold, and Silver ingots.', actor_id, actor_id),
    ('Tanning Rig', 'Buildings & Structures', 'Crafting Station (Wood)', 'Turns Rough Hide + Tannin into Tanned Leather.', actor_id, actor_id),
    ('Spinning Wheel', 'Buildings & Structures', 'Crafting Station (Wood)', 'Turns Plant Fiber / Flax Fiber into fabric.', actor_id, actor_id),

    ('Aloe Leaf', 'Resources', 'Gather from Foothills meadows', 'Natural remedy ingredient.', actor_id, actor_id),
    ('Ancient Scraps', 'Resources', 'Loot from ruins and ancient sites', 'Corroded metallic remnants.', actor_id, actor_id),
    ('Ash', 'Resources', 'Charcoal Kiln processing', 'Byproduct for advanced crafting.', actor_id, actor_id),
    ('Bezoar', 'Resources', 'Dropped by goats', 'Rare alchemical reagent.', actor_id, actor_id),
    ('Bird Meat', 'Resources', 'Hunt dodos and birds', 'Basic protein resource.', actor_id, actor_id),
    ('Bone Meal', 'Resources', 'Millstone: 5 Bones -> Bone Meal', 'Processed bone resource.', actor_id, actor_id),
    ('Bones', 'Resources', 'Enemy/animal drops', 'Core crafting drop.', actor_id, actor_id),
    ('Charcoal', 'Resources', 'Charcoal Kiln from Hardwood/Wood', 'Fuel and reagent.', actor_id, actor_id),
    ('Clay', 'Resources', 'Mine clay patches', 'Raw clay resource.', actor_id, actor_id),
    ('Coarse Fabric', 'Resources', 'Spinning Wheel from Plant Fiber', 'Entry textile material.', actor_id, actor_id),
    ('Copper Ingot', 'Resources', 'Smelt Copper Ore', 'Early refined metal.', actor_id, actor_id),
    ('Copper Ore', 'Resources', 'Mine in Copper caves', 'Raw copper ore.', actor_id, actor_id),
    ('Fish Fillet', 'Resources', 'Fishing', 'Versatile seafood ingredient.', actor_id, actor_id),
    ('Flax Fiber', 'Resources', 'Harvest or farm flax', 'Mid-tier textile plant.', actor_id, actor_id),
    ('Gold Ingot', 'Resources', 'Smelt gold ore', 'Epic metal for jewelry.', actor_id, actor_id),
    ('Gunpowder', 'Resources', 'Millstone mixing + pirate loot', 'Ammo and explosives component.', actor_id, actor_id),
    ('Hardwood', 'Resources', 'Chop Divi-divi trees', 'Premium wood resource.', actor_id, actor_id),
    ('Iron Ingot', 'Resources', 'Smelt Iron Ore', 'Mid-game refined metal.', actor_id, actor_id),
    ('Iron Ore', 'Resources', 'Mining on mid-tier islands', 'Core ore for progression.', actor_id, actor_id),
    ('Linen Fabric', 'Resources', 'Spinning Wheel from Flax Fiber', 'Refined textile.', actor_id, actor_id),
    ('Mire Metal Ingot', 'Resources', 'Advanced smelting', 'Tier 3 ingot from swamp materials.', actor_id, actor_id),
    ('Plague Wood', 'Resources', 'Harvest plague trees in swamp', 'Corrupted timber.', actor_id, actor_id),
    ('Plant Fiber', 'Resources', 'Harvest shrubs', 'Starter crafting material.', actor_id, actor_id),
    ('Quagmire Powder', 'Resources', 'Found in swamp biome', 'Swamp powder reagent.', actor_id, actor_id),
    ('Rope', 'Resources', 'Workbench from Plant Fiber + Wood', 'Common construction material.', actor_id, actor_id),
    ('Rough Hide', 'Resources', 'Dropped by boars/sows', 'Raw hide for tannery.', actor_id, actor_id),
    ('Silver Ingot', 'Resources', 'Smelt silver ore', 'Jewelry metal.', actor_id, actor_id),
    ('Stone', 'Resources', 'Smash rocks with pickaxe', 'Core raw building resource.', actor_id, actor_id),
    ('Sulfur', 'Resources', 'Mine advanced islands', 'Volatile mineral component.', actor_id, actor_id),
    ('Tanned Leather', 'Resources', 'Tanning Rig: Rough Hide + Tannin', 'Processed hide material.', actor_id, actor_id),
    ('Tannin', 'Resources', 'Alchemy Table: Clay Bottle + Tree Bark', 'Leather processing reagent.', actor_id, actor_id),
    ('Tar', 'Resources', 'Charcoal Kiln processing', 'Waterproofing and fabric treatment.', actor_id, actor_id),
    ('Tarred Fabric', 'Resources', 'Tanning Rig: Linen Fabric + Tar', 'Advanced fabric material.', actor_id, actor_id),
    ('Timber', 'Resources', 'Workbench from Wood', 'Heavy processed wood.', actor_id, actor_id),
    ('Tree Bark', 'Resources', 'Harvest from trees', 'Common natural material.', actor_id, actor_id),
    ('Wood', 'Resources', 'Chop trees and gather loose wood', 'Most common crafting material.', actor_id, actor_id),
    ('Wooden Plank', 'Resources', 'Workbench from Wood', 'Processed plank material.', actor_id, actor_id),

    ('Bandage', 'Consumables', '1 Coarse Fabric', 'Restores HP over time.', actor_id, actor_id),
    ('Minor Healing Potion', 'Consumables', 'Alchemy Table', 'Instantly restores 40% max HP.', actor_id, actor_id),
    ('Great Healing Potion', 'Consumables', 'Alchemy Table', 'Instantly restores 75% max HP.', actor_id, actor_id),
    ('Elixir of Concentration', 'Consumables', 'Alchemy Table', 'Crit Damage +40% for 15m.', actor_id, actor_id),
    ('Elixir of Cruelty', 'Consumables', 'Alchemy Table', 'All damage +5% for 15m.', actor_id, actor_id),
    ('Elixir of Firm Hand', 'Consumables', 'Alchemy Table', 'Melee damage +10% for 15m.', actor_id, actor_id),
    ('Elixir of Precision', 'Consumables', 'Alchemy Table', 'Ranged damage +10% for 15m.', actor_id, actor_id),
    ('Elixir of Pain Relief', 'Consumables', 'Alchemy Table', 'Damage reduction +15% for 15m.', actor_id, actor_id),
    ('Seafood Platter', 'Consumables', 'Cooking Fire', 'Epic +20 Vitality food.', actor_id, actor_id),
    ('Seasoned Crocodile Meat', 'Consumables', 'Cooking Fire', 'Epic +20 Strength food.', actor_id, actor_id),
    ('Swamp Pie', 'Consumables', 'Cooking Fire', 'Epic +20 Precision food.', actor_id, actor_id),
    ('Gazpacho', 'Consumables', 'Cooking Fire', 'Epic +20 Agility food.', actor_id, actor_id),
    ('Homeward Journey', 'Consumables', 'Crafting', 'Teleports to revival point.', actor_id, actor_id),

    ('Vigor', 'Talents', 'Talent point unlock', 'Increases maximum health.', actor_id, actor_id),
    ('Endurance', 'Talents', 'Talent point unlock', 'Increases maximum stamina.', actor_id, actor_id),
    ('Pack Mule', 'Talents', 'Talent point unlock', 'Raises carrying capacity.', actor_id, actor_id),
    ('Lumberjack', 'Talents', 'Talent point unlock', 'Increases tree resource yield.', actor_id, actor_id),
    ('Prospector', 'Talents', 'Talent point unlock', 'Improves mining output.', actor_id, actor_id),
    ('Deadeye', 'Talents', 'Talent point unlock', 'Headshot crit damage bonus.', actor_id, actor_id),
    ('Powder Monkey', 'Talents', 'Talent point unlock', 'Firearm reload speed bonus.', actor_id, actor_id),

    ('Bleeding', 'Status Effects', 'Rapier of a Thousand Cuts', 'Damage-over-time status.', actor_id, actor_id),
    ('Fire Damage', 'Status Effects', 'Dragon''s Breath Blunderbuss', 'Burning damage-over-time.', actor_id, actor_id),
    ('Vulnerability', 'Status Effects', 'Drake''s Double-Barreled Pistol (Epic)', 'Target takes increased incoming damage.', actor_id, actor_id),
    ('Rested', 'Status Effects', 'Bonfire / Comfort', 'Boosts stamina regeneration.', actor_id, actor_id),
    ('Winded', 'Status Effects', 'Fully depleted stamina', 'Prevents sprinting/dodging briefly.', actor_id, actor_id),

    ('Conquistador''s Helmet', 'Armor', 'Armor and Clothing Workshop', 'Rare heavy head armor.', actor_id, actor_id),
    ('Flibustier''s Hat', 'Armor', 'Armor and Clothing Workshop', 'Rare agile melee headgear.', actor_id, actor_id),
    ('Marksman''s Tricorn', 'Armor', 'Armor and Clothing Workshop', 'Rare ranged-focused hat.', actor_id, actor_id),
    ('Pikeman''s Helmet', 'Armor', 'Armor and Clothing Workshop', 'Rare two-handed combat helm.', actor_id, actor_id),
    ('Privateer''s Hat', 'Armor', 'Armor and Clothing Workshop', 'Rare critical-strike set piece.', actor_id, actor_id),
    ('Tracker''s Hat', 'Armor', 'Armor and Clothing Workshop', 'Rare support/healing set piece.', actor_id, actor_id),

    ('Icon Alchemy', 'Icon Information', 'Guide reference icon', 'Indicates alchemy-related crafting/workstations.', actor_id, actor_id),
    ('Icon Blacksmith', 'Icon Information', 'Guide reference icon', 'Indicates smithing and weapon crafting.', actor_id, actor_id),
    ('Icon Charcoal', 'Icon Information', 'Guide reference icon', 'Indicates charcoal kiln processing.', actor_id, actor_id),
    ('Icon Crafting', 'Icon Information', 'Guide reference icon', 'General crafting indicator.', actor_id, actor_id),
    ('Icon Enchanting', 'Icon Information', 'Guide reference icon', 'Enchanting table content marker.', actor_id, actor_id),
    ('Icon Equipment', 'Icon Information', 'Guide reference icon', 'Equipment/gear oriented info marker.', actor_id, actor_id),
    ('Icon Food', 'Icon Information', 'Guide reference icon', 'Consumables and cooking marker.', actor_id, actor_id),
    ('Icon Furnace', 'Icon Information', 'Guide reference icon', 'Smelting and furnace marker.', actor_id, actor_id),
    ('Icon Gunner', 'Icon Information', 'Guide reference icon', 'Ranged/firearm marker.', actor_id, actor_id),
    ('Icon Jewelry', 'Icon Information', 'Guide reference icon', 'Jewelry workstation/material marker.', actor_id, actor_id),
    ('Icon Lumberjack', 'Icon Information', 'Guide reference icon', 'Wood gathering marker.', actor_id, actor_id),
    ('Icon Milestones', 'Icon Information', 'Guide reference icon', 'Progression or milestone indicator.', actor_id, actor_id),
    ('Icon Spinningwheel', 'Icon Information', 'Guide reference icon', 'Textile processing marker.', actor_id, actor_id),
    ('Icon Tannery', 'Icon Information', 'Guide reference icon', 'Leather and tannery marker.', actor_id, actor_id)
  on conflict ((lower(item_name)))
  do update set
    item_category = excluded.item_category,
    crafting_recipe = excluded.crafting_recipe,
    notes = excluded.notes,
    updated_by = excluded.updated_by,
    updated_at = now();
end
$$;
