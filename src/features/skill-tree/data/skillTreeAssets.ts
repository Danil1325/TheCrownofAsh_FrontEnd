import arcaneShieldBack from '../../../assets/SkillTree/human/human_skill_back/arcane_shield_back.png'
import arcaneShieldFront from '../../../assets/SkillTree/human/human_skill_front/arcane_shield_front.png'
import arcaneShieldIcon from '../../../assets/SkillTree/human/human_skill_icon/arcane_shield_icon.png'
import improvisedSpellBack from '../../../assets/SkillTree/human/human_skill_back/improvised_spell_back.png'
import improvisedSpellFront from '../../../assets/SkillTree/human/human_skill_front/improvised_spell_front.png'
import improvisedSpellIcon from '../../../assets/SkillTree/human/human_skill_icon/improvised_spell_icon.png'
import manaReserveBack from '../../../assets/SkillTree/human/human_skill_back/mana_reserve_back.png'
import manaReserveFront from '../../../assets/SkillTree/human/human_skill_front/mana_reserve_front.png'
import manaReserveIcon from '../../../assets/SkillTree/human/human_skill_icon/mana_reserve_icon.png'
import overchargeBack from '../../../assets/SkillTree/human/human_skill_back/overcharge_back.png'
import overchargeFront from '../../../assets/SkillTree/human/human_skill_front/overcharge_front.png'
import overchargeIcon from '../../../assets/SkillTree/human/human_skill_icon/overcharge_icon.png'
import quickStudyBack from '../../../assets/SkillTree/human/human_skill_back/quick_study_back.png'
import quickStudyFront from '../../../assets/SkillTree/human/human_skill_front/quick_study_front.png'
import quickStudyIcon from '../../../assets/SkillTree/human/human_skill_icon/quick_study_icon.png'
import type { Skill } from '../types/skillTree'

export interface SkillTreeAssetBundle {
  icon?: string
  cardFront?: string
  cardBack?: string
}

export const skillTreeAssetsBySkillId: Partial<
  Record<Skill['id'], SkillTreeAssetBundle>
> = {
  'human-mage-quick-study': {
    icon: quickStudyIcon,
    cardFront: quickStudyFront,
    cardBack: quickStudyBack,
  },
  'human-mage-mana-reserve': {
    icon: manaReserveIcon,
    cardFront: manaReserveFront,
    cardBack: manaReserveBack,
  },
  'human-mage-improvised-spell': {
    icon: improvisedSpellIcon,
    cardFront: improvisedSpellFront,
    cardBack: improvisedSpellBack,
  },
  'human-mage-arcane-shield': {
    icon: arcaneShieldIcon,
    cardFront: arcaneShieldFront,
    cardBack: arcaneShieldBack,
  },
  'human-mage-overcharge': {
    icon: overchargeIcon,
    cardFront: overchargeFront,
    cardBack: overchargeBack,
  },
}

export function getSkillTreeAssets(skillId: Skill['id']) {
  return skillTreeAssetsBySkillId[skillId]
}
