import { useMemo, useState } from 'react'
import { CategoryMenu } from './components/CategoryMenu'
import { FantasyIcon } from './components/FantasyIcon'
import { SkillDetailsPanel } from './components/SkillDetailsPanel'
import { SkillNode } from './components/SkillNode'
import { TreeConnections } from './components/TreeConnections'
import {
  getSkillBuildForCharacter,
  SKILL_TREE_FALLBACK_ACTIVE_CHARACTER,
} from './config/skillProgression'
import { skillCategories, skillTreeData } from './data/skillTreeData'
import { useSkillProgression } from './hooks/useSkillProgression'
import type {
  RenderedSkillState,
  Skill,
  ActiveSkillTreeCharacter,
  ActiveSkillTreeCharacterInput,
  SkillBuild,
  SkillCategoryId,
  SkillTreeNode,
} from './types/skillTree'
import './SkillTree.css'

interface SkillTreeProps {
  activeCharacter?: ActiveSkillTreeCharacterInput
  onBackToMap?: () => void
}

const FALLBACK_BUILD =
  getSkillBuildForCharacter(skillTreeData, SKILL_TREE_FALLBACK_ACTIVE_CHARACTER) ??
  skillTreeData[0]
const FALLBACK_FIRST_SKILL = FALLBACK_BUILD?.skills[0]
const FALLBACK_CATEGORY = skillCategories[0]

if (!FALLBACK_BUILD || !FALLBACK_FIRST_SKILL || !FALLBACK_CATEGORY) {
  throw new Error('Skill tree data is missing its default build.')
}

const RUNE_LINE = [
  '\u16a0',
  '\u16c9',
  '\u16b1',
  '\u16da',
  '\u16be',
  '\u16d7',
  '\u16c1',
  '\u16de',
  '\u16b7',
  '\u16ca',
  '\u16d6',
  '\u16a2',
].join('').repeat(5)

const STATE_LABELS: Record<RenderedSkillState, string> = {
  unlocked: 'Unlocked',
  available: 'Available',
  locked: 'Locked',
  selected: 'Selected',
}

const NODE_INPUT_OFFSET_Y = 2.3
const SECOND_ROW_NODE_IDS = new Set(['left-a', 'center-a', 'right-a'])

function getCategory(categoryId: SkillCategoryId) {
  return (
    skillCategories.find((category) => category.id === categoryId) ??
    FALLBACK_CATEGORY
  )
}

function getResolvedCharacter(
  activeCharacter: ActiveSkillTreeCharacterInput | undefined,
): ActiveSkillTreeCharacter {
  if (!activeCharacter) {
    return SKILL_TREE_FALLBACK_ACTIVE_CHARACTER
  }

  return {
    ...SKILL_TREE_FALLBACK_ACTIVE_CHARACTER,
    ...activeCharacter,
    level:
      activeCharacter.level ?? SKILL_TREE_FALLBACK_ACTIVE_CHARACTER.level,
  }
}

function getEmptyCategorySkillIds() {
  return skillCategories.reduce((categorySkillIds, category) => {
    categorySkillIds[category.id] = []

    return categorySkillIds
  }, {} as SkillBuild['categorySkillIds'])
}

function getEmptySkillSlots() {
  return skillCategories.reduce((skillSlots, category) => {
    skillSlots[category.id] = {}

    return skillSlots
  }, {} as SkillBuild['skillSlots'])
}

function getEmptyBuildForCharacter(
  character: ActiveSkillTreeCharacter,
  layoutBuild: SkillBuild,
): SkillBuild {
  return {
    ...layoutBuild,
    race: character.race,
    className: character.className,
    archetype: `${character.race} ${character.className}`,
    quote: 'No approved abilities have been inscribed for this path yet.',
    categorySkillIds: getEmptyCategorySkillIds(),
    skillSlots: getEmptySkillSlots(),
    skills: [],
  }
}

function getNodeMap(nodes: SkillTreeNode[]) {
  return new Map(nodes.map((node) => [node.id, node]))
}

function getOutputOffsetY(node: SkillTreeNode) {
  if (node.id === 'root') {
    return 22.2
  }

  if (SECOND_ROW_NODE_IDS.has(node.id)) {
    return 18.7
  }

  return 15.2
}

function getCategorySkillIds(
  build: SkillBuild,
  categoryId: SkillCategoryId,
) {
  return build.categorySkillIds[categoryId] ?? []
}

function getSkillsForCategory(
  build: SkillBuild,
  skillById: Map<string, Skill>,
  categoryId: SkillCategoryId,
) {
  return getCategorySkillIds(build, categoryId).flatMap((skillId) => {
    const skill = skillById.get(skillId)

    return skill ? [skill] : []
  })
}

function getCategorySkillCounts(build: SkillBuild) {
  return skillCategories.reduce((counts, category) => {
    counts.set(category.id, getCategorySkillIds(build, category.id).length)

    return counts
  }, new Map<SkillCategoryId, number>())
}

function getConnectionGeometry(from: SkillTreeNode, to: SkillTreeNode) {
  const startY = from.y + getOutputOffsetY(from)
  const endY = to.y + NODE_INPUT_OFFSET_Y
  const distanceX = to.x - from.x
  const horizontalSpan = Math.abs(distanceX)

  if (horizontalSpan < 4) {
    const curveY = startY + (endY - startY) * 0.52

    return {
      path: `M ${from.x} ${startY} C ${from.x} ${curveY} ${to.x} ${curveY} ${to.x} ${endY}`,
      startX: from.x,
      startY,
      junctionX: from.x,
      junctionY: curveY,
      endX: to.x,
      endY,
    }
  }

  const verticalSpan = Math.max(endY - startY, 2.8)
  const branchDepth = Math.min(
    Math.max(verticalSpan * 0.5, 2.4),
    Math.max(verticalSpan - 1.4, 1.4),
    6.8,
  )
  const branchY = startY + branchDepth
  const direction = distanceX > 0 ? 1 : -1
  const radius = Math.min(
    3.2,
    Math.max(1.25, horizontalSpan * 0.08),
    Math.max((endY - branchY) * 0.5, 0.8),
  )
  const startCurveX = from.x + direction * radius
  const endCurveX = to.x - direction * radius

  return {
    path: [
      `M ${from.x} ${startY}`,
      `V ${branchY - radius}`,
      `Q ${from.x} ${branchY} ${startCurveX} ${branchY}`,
      `H ${endCurveX}`,
      `Q ${to.x} ${branchY} ${to.x} ${branchY + radius}`,
      `V ${endY}`,
    ].join(' '),
    startX: from.x,
    startY,
    junctionX: from.x + distanceX * 0.5,
    junctionY: branchY,
    endX: to.x,
    endY,
  }
}

function getRenderedNodes(
  build: SkillBuild,
  skillById: Map<string, Skill>,
  activeCategoryId: SkillCategoryId,
) {
  const activeSkillIds = new Set(getCategorySkillIds(build, activeCategoryId))
  const skillSlots = build.skillSlots[activeCategoryId] ?? {}

  return build.nodes.map((node) => {
    const skillId = skillSlots[node.id]
    const skill =
      skillId && activeSkillIds.has(skillId) ? skillById.get(skillId) : undefined

    return { node, skill }
  })
}

function SkillTree({ activeCharacter, onBackToMap }: SkillTreeProps) {
  const currentCharacter = useMemo(() => {
    return getResolvedCharacter(activeCharacter)
  }, [activeCharacter])
  const currentBuild = useMemo(() => {
    const configuredBuild = getSkillBuildForCharacter(
      skillTreeData,
      currentCharacter,
    )

    if (configuredBuild) {
      return configuredBuild
    }

    return activeCharacter
      ? getEmptyBuildForCharacter(currentCharacter, FALLBACK_BUILD)
      : FALLBACK_BUILD
  }, [activeCharacter, currentCharacter])
  const {
    availableSkillPoints,
    getUnlockEvaluation,
    skillById,
    unlockSkill,
  } = useSkillProgression(currentBuild, currentCharacter)
  const categorySkillCounts = getCategorySkillCounts(currentBuild)

  const [activeCategoryId, setActiveCategoryId] = useState(
    currentBuild.activeCategory,
  )
  const [selectedSkillId, setSelectedSkillId] = useState<
    string | undefined
  >(() => {
    return getSkillsForCategory(
      currentBuild,
      skillById,
      currentBuild.activeCategory,
    )[0]?.id
  })

  const activeCategory = getCategory(activeCategoryId)
  const activeSkills = getSkillsForCategory(
    currentBuild,
    skillById,
    activeCategoryId,
  )
  const renderedNodes = getRenderedNodes(
    currentBuild,
    skillById,
    activeCategoryId,
  )
  const activeNodeById = getNodeMap(
    renderedNodes.map(({ node }) => node),
  )
  const renderedSkillIdByNodeId = new Map(
    renderedNodes.map(({ node, skill }) => [node.id, skill?.id]),
  )
  const selectedCandidate = selectedSkillId
    ? skillById.get(selectedSkillId)
    : undefined
  const selectedSkill =
    selectedCandidate &&
    activeSkills.some((skill) => skill.id === selectedCandidate.id)
      ? selectedCandidate
      : activeSkills[0]
  const selectedSkillRenderId = selectedSkill?.id
  const hasActiveSkills = activeSkills.length > 0
  const rootNodeId = currentBuild.nodes[0]?.id
  const selectedSkillUnlock = getUnlockEvaluation(selectedSkill)
  const statusLabel = selectedSkill
    ? STATE_LABELS[selectedSkillUnlock.progressionState]
    : 'No current abilities'
  const treeCanvasClasses = [
    'tree-canvas',
    'tree-canvas--reference',
    hasActiveSkills ? '' : 'tree-canvas--placeholder-only',
    hasActiveSkills ? '' : 'tree-canvas--no-approved-skills',
  ]
    .filter(Boolean)
    .join(' ')

  const renderedConnections = currentBuild.connections.flatMap(
    (connection) => {
      const fromNode = activeNodeById.get(connection.from)
      const toNode = activeNodeById.get(connection.to)

      if (!fromNode || !toNode) {
        return []
      }

      return [
        {
          id: `${connection.from}-${connection.to}`,
          ...getConnectionGeometry(fromNode, toNode),
          isSelected:
            renderedSkillIdByNodeId.get(connection.from) ===
              selectedSkillRenderId ||
            renderedSkillIdByNodeId.get(connection.to) === selectedSkillRenderId,
        },
      ]
    },
  )

  const handleSelectCategory = (categoryId: SkillCategoryId) => {
    const firstSkillForCategory = getSkillsForCategory(
      currentBuild,
      skillById,
      categoryId,
    )

    setActiveCategoryId(categoryId)
    setSelectedSkillId(firstSkillForCategory[0]?.id)
  }

  const handleBackToMap = () => {
    // Routing lives outside this isolated feature; App can pass this when ready.
    onBackToMap?.()
  }

  return (
    <main
      className={`skill-tree-page skill-tree-page--${activeCategory.id}`}
      aria-label="Skill Tree"
    >
      <div className="rune-frame" aria-hidden="true">
        <span className="corner-ornament corner-ornament--top-left" />
        <span className="corner-ornament corner-ornament--top-right" />
        <span className="corner-ornament corner-ornament--bottom-right" />
        <span className="corner-ornament corner-ornament--bottom-left" />
        <span className="rune-strip rune-strip--top">{RUNE_LINE}</span>
        <span className="rune-strip rune-strip--right">{RUNE_LINE}</span>
        <span className="rune-strip rune-strip--bottom">{RUNE_LINE}</span>
        <span className="rune-strip rune-strip--left">{RUNE_LINE}</span>
      </div>

      <div className="skill-tree-ui">
        <header className="skill-tree-header">
          <button
            type="button"
            className="back-button"
            aria-label="Back to Menu"
            onClick={handleBackToMap}
          >
            <span className="back-button__arrow" aria-hidden="true">
              {'\u2190'}
            </span>
            <span>BACK TO MENU</span>
          </button>

          <div className="skill-tree-title">
            <span className="title-decoration" aria-hidden="true">
              <FantasyIcon icon="arcane-star" className="fantasy-icon" />
            </span>

            <h1>PATHS OF MASTERY</h1>

            <span className="title-decoration" aria-hidden="true">
              <FantasyIcon icon="arcane-star" className="fantasy-icon" />
            </span>
          </div>

          <p className="skill-tree-subtitle">
            MASTER YOUR PATH {'\u2022'} GROW STRONGER {'\u2022'} SHAPE YOUR
            FATE
          </p>

          <div
            className="skill-points"
            aria-label={`${availableSkillPoints} available skill points`}
          >
            <span>SKILL POINTS</span>
            <strong>{availableSkillPoints}</strong>
          </div>
        </header>

        <section className="skill-tree-layout">
          <aside className="skill-tree-sidebar">
            <CategoryMenu
              categories={skillCategories}
              activeCategoryId={activeCategoryId}
              categorySkillCounts={categorySkillCounts}
              onSelectCategory={handleSelectCategory}
            />

            <p className="sidebar-quote">"{currentBuild.quote}"</p>
          </aside>

          <section className="skill-tree-center" aria-label="Skill branches">
            <div className="tree-banner">
              <span className="tree-banner__icon" aria-hidden="true">
                <FantasyIcon icon={activeCategory.icon} className="fantasy-icon" />
              </span>
              <strong>{activeCategory.label}</strong>
            </div>

            <div className={treeCanvasClasses}>
              <TreeConnections connections={renderedConnections} />

              {!hasActiveSkills && (
                <div className="tree-empty-state" role="status" aria-live="polite">
                  <span className="tree-empty-state__icon" aria-hidden="true">
                    <FantasyIcon icon={activeCategory.icon} className="fantasy-icon" />
                  </span>
                  <p className="tree-empty-state__message">
                    No approved abilities have been inscribed for this path yet.
                  </p>
                </div>
              )}

              {renderedNodes.map(({ node, skill }) => {
                const unlockEvaluation = getUnlockEvaluation(skill)
                const isSelected =
                  Boolean(skill) && selectedSkillRenderId === skill?.id

                return (
                  <SkillNode
                    key={node.id}
                    skill={skill}
                    node={node}
                    progressionState={unlockEvaluation.progressionState}
                    isSelected={isSelected}
                    isRoot={node.id === rootNodeId}
                    onSelect={setSelectedSkillId}
                  />
                )
              })}
            </div>
          </section>

          <SkillDetailsPanel
            activeCategory={activeCategory}
            build={currentBuild}
            selectedSkill={selectedSkill}
            statusLabel={statusLabel}
            unlockEvaluation={selectedSkillUnlock}
            onUnlockSkill={unlockSkill}
          />
        </section>

        <footer className="skill-tree-footer">
          {(['unlocked', 'locked', 'available', 'selected'] as const).map(
            (state) => (
              <div key={state}>
                <span
                  className={`legend-dot legend-dot--${state}`}
                  aria-hidden="true"
                />
                {STATE_LABELS[state]}
              </div>
            ),
          )}

          <p>"SKILLS TURN POTENTIAL INTO POWER."</p>
        </footer>
      </div>
    </main>
  )
}

export default SkillTree
