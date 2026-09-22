import type { Skill } from '../types/skillTree'

export interface SkillTreeAssetBundle {
  icon?: string
  cardFront?: string
  cardBack?: string
}

const skillTreeAssetFiles = import.meta.glob<string>(
  '../../../assets/SkillTree/**/*.png',
  { eager: true, import: 'default' },
)

function getAsset(path: string) {
  const asset = skillTreeAssetFiles[path]

  if (!asset) {
    throw new Error(`Missing Skill Tree asset: ${path}`)
  }

  return asset
}

function skillAsset(
  iconPath: string,
  frontPath: string,
  backPath: string,
): SkillTreeAssetBundle {
  return {
    icon: getAsset(iconPath),
    cardFront: getAsset(frontPath),
    cardBack: getAsset(backPath),
  }
}

function humanSkill(iconName: string, cardName = iconName) {
  return skillAsset(
    `../../../assets/SkillTree/human/human_skill_icon/${iconName}_icon.png`,
    `../../../assets/SkillTree/human/human_skill_front/${cardName}_front.png`,
    `../../../assets/SkillTree/human/human_skill_back/${cardName}_back.png`,
  )
}

function orcSkill(fileName: string) {
  return skillAsset(
    `../../../assets/SkillTree/Orc_skills/orc_skill_icons/${fileName}_icon.png`,
    `../../../assets/SkillTree/Orc_skills/orc_skills_front/${fileName}_front.png`,
    `../../../assets/SkillTree/Orc_skills/orc_skills_back/${fileName}_back.png`,
  )
}

function dwarfSkill(iconName: string, cardName = iconName) {
  return skillAsset(
    `../../../assets/SkillTree/Dwarf_skills/dwarf_skill_icons/${iconName}_icon.png`,
    `../../../assets/SkillTree/Dwarf_skills/dwarf_skill_front/${cardName}_front.png`,
    `../../../assets/SkillTree/Dwarf_skills/dwarf_skill_back/${cardName}_back.png`,
  )
}

function elfSkill(iconName: string, frontName = iconName, backName = iconName) {
  return skillAsset(
    `../../../assets/SkillTree/Elf skills/elf_skill_icons/${iconName}_icon.png`,
    `../../../assets/SkillTree/Elf skills/elf_skill_front/${frontName}_front.png`,
    `../../../assets/SkillTree/Elf skills/elf_skill_back/${backName}_back.png`,
  )
}

export const skillTreeAssetsBySkillId: Partial<
  Record<Skill['id'], SkillTreeAssetBundle>
> = {
  'human-mage-quick-study': humanSkill('quick_study'),
  'human-mage-mana-reserve': humanSkill('mana_reserve'),
  'human-mage-improvised-spell': humanSkill('improvised_spell'),
  'human-mage-arcane-shield': humanSkill('arcane_shield'),
  'human-mage-overcharge': humanSkill('overcharge'),

  'human-warrior-human-determination': humanSkill('human_determination'),
  'human-warrior-tactical-strike': humanSkill('tactical_strike'),
  'human-warrior-counterattack': humanSkill('counterattack'),
  'human-warrior-second-wind': humanSkill('second_wind'),
  'human-warrior-last-stand': humanSkill('last_stand_human', 'last_stand'),

  'human-bard-inspiring-tune': humanSkill('inspiring_tune'),
  'human-bard-quick-melody': humanSkill('quick_melody'),
  'human-bard-encore': humanSkill('encore'),
  'human-bard-lucky-performance': humanSkill('lucky_performance'),
  'human-bard-rally-cry': humanSkill('rally_cry'),
  'human-bard-versatile-performer': humanSkill('versatile_performer'),
  'human-bard-jack-of-all-trades': humanSkill('jack_of_all_trades'),

  'human-healer-healing-touch': humanSkill('healing_touch'),
  'human-healer-first-aid': humanSkill('first_aid'),
  'human-healer-emergency-heal': humanSkill('emergency_heal'),
  'human-healer-protective-prayer': humanSkill('protective_prayer'),
  'human-healer-battle-medic': humanSkill('battle_medic'),
  'human-healer-adaptable-healing': humanSkill('adaptable_healing'),
  'human-healer-second-chance': humanSkill(
    'second_chance_human',
    'second_chance',
  ),

  'orc-warrior-blood-rage': orcSkill('bloog_rage'),
  'orc-warrior-brutal-strike': orcSkill('brutal_strike'),
  'orc-warrior-savage-momentum': orcSkill('savage_momentum'),
  'orc-warrior-battle-strike': orcSkill('battle_strike'),
  'orc-warrior-berserkers-frenzy': orcSkill('berserker`s_frenzy'),
  'orc-warrior-executioner': orcSkill('executioner'),
  'orc-warrior-pain-is-power': orcSkill('pain_is_power'),

  'orc-mage-blood-magic': orcSkill('blood_magic'),
  'orc-mage-brutal-spell': orcSkill('brutal_spell'),
  'orc-mage-rage-casting': orcSkill('rage_casting'),
  'orc-mage-unstable-magic': orcSkill('unstable_magic'),
  'orc-mage-forbidden-overload': orcSkill('forbidden_overload'),
  'orc-mage-internal-burst': orcSkill('internal_burst'),
  'orc-mage-shamans-curse': orcSkill('shaman`s_curse'),

  'orc-bard-war-drum': orcSkill('war_drum'),
  'orc-bard-blood-song': orcSkill('blod_song'),
  'orc-bard-fury-chorus': orcSkill('fury_chorus'),
  'orc-bard-savage-rhythm': orcSkill('savage_rhythm'),
  'orc-bard-last-song': orcSkill('last_song'),
  'orc-bard-death-march': orcSkill('death_march'),
  'orc-bard-intimidating-roar': orcSkill('intimidating_roar'),

  'orc-healer-blood-heal': orcSkill('blood_heal'),
  'orc-healer-blood-ritual': orcSkill('blood_ritual'),
  'orc-healer-pain-transfer': orcSkill('pain_transfer'),
  'orc-healer-pain-amplification': orcSkill('plain_amplification'),
  'orc-healer-savage-recovery': orcSkill('savage_recovery'),
  'orc-healer-spirit-of-battle': orcSkill('spirit_of_battle'),
  'orc-healer-warriors-blessing': orcSkill('warrior`s_blessing'),

  'dwarf-warrior-dwarven-constitution': dwarfSkill(
    'dwarven_constitution',
  ),
  'dwarf-warrior-mountain-stance': dwarfSkill('mountain_stance'),
  'dwarf-warrior-shield-bash': dwarfSkill('shield_bash'),
  'dwarf-warrior-iron-wall': dwarfSkill('iron_wall'),
  'dwarf-warrior-runic-armor': dwarfSkill('runic_armor'),
  'dwarf-warrior-fortress': dwarfSkill('fortress'),
  'dwarf-warrior-unbreakable': dwarfSkill('umbreakable'),

  'dwarf-mage-heavy-casting': dwarfSkill('heavy_casting'),
  'dwarf-mage-mana-forge': dwarfSkill('mana_forge'),
  'dwarf-mage-rune-of-power': dwarfSkill('rune_of_power'),
  'dwarf-mage-stone-barrier': dwarfSkill('stone_barrier'),
  'dwarf-mage-ancient-rune': dwarfSkill('ancient_rune'),
  'dwarf-mage-war-forge': dwarfSkill('war_forge'),
  'dwarf-mage-runic-fortress': dwarfSkill('runic_fortress'),

  'dwarf-bard-anvil-beat': dwarfSkill('anvil_beat'),
  'dwarf-bard-hammer-rhythm': dwarfSkill('hammer_rhythm'),
  'dwarf-bard-forge-song': dwarfSkill('forge_song'),
  'dwarf-bard-drums-of-the-mountain': dwarfSkill(
    'drums_of_the_mountain',
  ),
  'dwarf-bard-iron-chorus': dwarfSkill('iron_chorus'),
  'dwarf-bard-unyielding-melody': dwarfSkill('unyielding_melody'),
  'dwarf-bard-living-fortress': dwarfSkill('living_fortress'),

  'dwarf-healer-stone-heal': dwarfSkill('stone_heal'),
  'dwarf-healer-healing-ground': dwarfSkill('healing_ground'),
  'dwarf-healer-mountain-blessing': dwarfSkill('mountain_blessing'),
  'dwarf-healer-rune-of-protection': dwarfSkill('rune_of_protection'),
  'dwarf-healer-ancient-protection': dwarfSkill('ancient_protection'),
  'dwarf-healer-purifying-rune': dwarfSkill(
    'purifying_rune',
    'purifyng_rune',
  ),
  'dwarf-healer-stone-skin': dwarfSkill('stone_skin'),

  'elf-warrior-elven-grace': elfSkill('elven_grace'),
  'elf-warrior-swift-blade': elfSkill('swift_blade'),
  'elf-warrior-dance-of-blades': elfSkill('dance_of_blades'),
  'elf-warrior-glass-blade': elfSkill('glass_blade'),
  'elf-warrior-perfect-counter': elfSkill('perfect_counter'),
  'elf-warrior-whirling-blades': elfSkill('whirling_blades'),
  'elf-warrior-graceful-step': elfSkill('graceful_step'),

  'elf-mage-arcane-precision': elfSkill('arcane_precision'),
  'elf-mage-blink': elfSkill('blink'),
  'elf-mage-fey-focus': elfSkill('fey_focus'),
  'elf-mage-fey-illusion': elfSkill(
    'fey_illusion_elfmage',
    'fey_illusion_elfmage',
    'fey_illusion_elfmage',
  ),
  'elf-mage-mana-bloom': elfSkill('mana_bloom'),
  'elf-mage-moonlight-spell': skillAsset(
    '../../../assets/SkillTree/Elf skills/elf_skill_icons/moonlight_spell_icon.png',
    '../../../assets/SkillTree/Elf skills/elf_skill_front/moonlight_spel_frontl.png',
    '../../../assets/SkillTree/Elf skills/elf_skill_back/moonlight_spell_back.png',
  ),
  'elf-mage-arcane-perfection': elfSkill('arcane_perfection'),

  'elf-bard-charming-tune': elfSkill('charming_tune'),
  'elf-bard-fey-melody': elfSkill('fey_melody'),
  'elf-bard-song-of-speed': elfSkill('song_of_speed'),
  'elf-bard-moonlight-ballad': elfSkill('moonlight_ballad'),
  'elf-bard-fey-illusion': elfSkill(
    'fey_illusion',
    'fey_illusion_elfbard',
    'fey_illusion',
  ),
  'elf-bard-elven-harmony': elfSkill('elven_harmony'),
  'elf-bard-eternal-performance': elfSkill('eternal_performance'),

  'elf-healer-healing-light': elfSkill('healing_light'),
  'elf-healer-life-bloom': elfSkill('life_bloom'),
  'elf-healer-moon-heal': elfSkill('moon_heal'),
  'elf-healer-natures-touch': elfSkill('natures_touch'),
  'elf-healer-purifying-leaves': elfSkill('purifying_leaves'),
  'elf-healer-rebirth-of-nature': elfSkill('rebirth_of_nature'),
  'elf-healer-fey-protection': elfSkill('fey_protection'),
}

export function getSkillTreeAssets(skillId: Skill['id']) {
  return skillTreeAssetsBySkillId[skillId]
}
