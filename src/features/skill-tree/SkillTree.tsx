import { useState } from 'react'
import { CategoryMenu } from './components/CategoryMenu'
import { FantasyIcon } from './components/FantasyIcon'
import { SkillDetailsPanel } from './components/SkillDetailsPanel'
import { SkillNode } from './components/SkillNode'
import { TreeConnections } from './components/TreeConnections'
import { skillCategories, skillTreeData } from './data/skillTreeData'
import type {
  RenderedSkillState,
  Skill,
  SkillBuild,
  SkillCategoryId,
  SkillTreeNode,
} from './types/skillTree'
import './SkillTree.css'

interface SkillTreeProps {
  onBackToMap?: () => void
}

const CURRENT_BUILD = skillTreeData[0]
const FIRST_SKILL = CURRENT_BUILD?.skills[0]
const FALLBACK_CATEGORY = skillCategories[0]

if (!CURRENT_BUILD || !FIRST_SKILL || !FALLBACK_CATEGORY) {
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

function getCategory(categoryId: SkillCategoryId) {
  return (
    skillCategories.find((category) => category.id === categoryId) ??
    FALLBACK_CATEGORY
  )
}

function getSkillMap(build: SkillBuild) {
  return new Map(build.skills.map((skill) => [skill.id, skill]))
}

function getNodeMap(nodes: SkillTreeNode[]) {
  return new Map(nodes.map((node) => [node.id, node]))
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
  const startY = from.y + 11.8
  const endY = to.y + 1.4
  const distanceX = to.x - from.x
  const horizontalSpan = Math.abs(distanceX)
  const verticalSpan = Math.max(endY - startY, 3)
  const junctionRatio = verticalSpan > 24 ? 0.64 : 0.48
  const junctionY = startY + verticalSpan * junctionRatio

  if (horizontalSpan < 4) {
    const curveY = startY + verticalSpan * 0.5

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

  const direction = distanceX > 0 ? 1 : -1
  const radius = Math.min(4.4, Math.max(2.1, horizontalSpan * 0.12))
  const startCurveX = from.x + direction * radius
  const endCurveX = to.x - direction * radius

  return {
    path: [
      `M ${from.x} ${startY}`,
      `V ${junctionY - radius}`,
      `Q ${from.x} ${junctionY} ${startCurveX} ${junctionY}`,
      `H ${endCurveX}`,
      `Q ${to.x} ${junctionY} ${to.x} ${junctionY + radius}`,
      `V ${endY}`,
    ].join(' '),
    startX: from.x,
    startY,
    junctionX: from.x + distanceX * 0.5,
    junctionY,
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

function SkillTree({ onBackToMap }: SkillTreeProps) {
  const currentBuild = CURRENT_BUILD
  const skillById = getSkillMap(currentBuild)
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
  const statusLabel = selectedSkill
    ? STATE_LABELS.selected
    : 'No current abilities'
  const treeCanvasClasses = [
    'tree-canvas',
    'tree-canvas--reference',
    hasActiveSkills ? '' : 'tree-canvas--placeholder-only',
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
            aria-label="Back to Map"
            onClick={handleBackToMap}
          >
            <span className="back-button__arrow" aria-hidden="true">
              {'\u2190'}
            </span>
            <span>BACK TO MAP</span>
          </button>

          <div className="skill-tree-title">
            <span className="title-decoration" aria-hidden="true">
              <FantasyIcon icon="arcane-star" className="fantasy-icon" />
            </span>

            <h1>SKILL TREE</h1>

            <span className="title-decoration" aria-hidden="true">
              <FantasyIcon icon="arcane-star" className="fantasy-icon" />
            </span>
          </div>

          <p className="skill-tree-subtitle">
            MASTER YOUR PATH {'\u2022'} GROW STRONGER {'\u2022'} SHAPE YOUR
            FATE
          </p>

          <div className="skill-points" aria-label="Skill points not defined">
            <span>SKILL POINTS</span>
            <strong>TBD</strong>
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

              {renderedNodes.map(({ node, skill }) => {
                const renderedState: RenderedSkillState =
                  skill && selectedSkillRenderId === skill.id
                    ? 'selected'
                    : skill
                      ? node.displayState
                      : 'locked'

                return (
                  <SkillNode
                    key={node.id}
                    skill={skill}
                    node={node}
                    state={renderedState}
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
