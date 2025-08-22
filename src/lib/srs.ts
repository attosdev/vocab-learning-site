// Simplified SRS (Spaced Repetition System) based on SM-2 algorithm

export interface SRSCard {
  wordId: string
  interval: number // days
  ease: number // 1.3 ~ 2.5
  reps: number
  lapses: number
  lastReviewed: number
  nextReview: number
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5

// Quality mapping:
// 0 = Total blackout, incorrect
// 1 = Incorrect, but remembered on second thought
// 2 = Incorrect, but seemed familiar
// 3 = Correct with difficulty
// 4 = Correct with some hesitation
// 5 = Perfect response

export class SRSManager {
  static createNewCard(wordId: string): SRSCard {
    return {
      wordId,
      interval: 1,
      ease: 2.5,
      reps: 0,
      lapses: 0,
      lastReviewed: Date.now(),
      nextReview: Date.now() + 24 * 60 * 60 * 1000, // Tomorrow
    }
  }

  static updateCard(card: SRSCard, quality: Quality): SRSCard {
    const now = Date.now()
    let { interval, ease, reps, lapses } = card

    // Update repetitions and lapses
    if (quality < 3) {
      // Incorrect answer
      reps = 0
      lapses += 1
      interval = 1
    } else {
      // Correct answer
      reps += 1
      
      // Calculate new interval
      if (reps === 1) {
        interval = 1
      } else if (reps === 2) {
        interval = 6
      } else {
        interval = Math.round(interval * ease)
      }
    }

    // Update ease factor (only for correct answers)
    if (quality >= 3) {
      ease = Math.max(
        1.3,
        ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      )
    }

    // Calculate next review time
    const nextReview = now + interval * 24 * 60 * 60 * 1000

    return {
      ...card,
      interval,
      ease: Math.round(ease * 100) / 100, // Round to 2 decimal places
      reps,
      lapses,
      lastReviewed: now,
      nextReview,
    }
  }

  static isDue(card: SRSCard): boolean {
    return card.nextReview <= Date.now()
  }

  static getDaysUntilReview(card: SRSCard): number {
    const msUntilReview = card.nextReview - Date.now()
    return Math.ceil(msUntilReview / (24 * 60 * 60 * 1000))
  }

  static getCardsForReview(cards: SRSCard[]): SRSCard[] {
    return cards
      .filter(card => this.isDue(card))
      .sort((a, b) => a.nextReview - b.nextReview)
  }

  static getStudyStats(cards: SRSCard[]) {
    const now = Date.now()
    const today = new Date(now).setHours(0, 0, 0, 0)
    const tomorrow = today + 24 * 60 * 60 * 1000

    const dueToday = cards.filter(card => card.nextReview <= now).length
    const dueTomorrow = cards.filter(
      card => card.nextReview > now && card.nextReview <= tomorrow
    ).length

    const reviewedToday = cards.filter(
      card => card.lastReviewed >= today
    ).length

    const totalCards = cards.length
    const matureCards = cards.filter(card => card.reps >= 2).length
    const newCards = cards.filter(card => card.reps === 0).length

    return {
      dueToday,
      dueTomorrow,
      reviewedToday,
      totalCards,
      matureCards,
      newCards,
    }
  }

  // Convert user input to quality score
  static mapUserResponseToQuality(
    isCorrect: boolean,
    confidence: 'easy' | 'good' | 'hard' = 'good'
  ): Quality {
    if (!isCorrect) {
      return 0 // Total failure
    }

    switch (confidence) {
      case 'easy':
        return 5 // Perfect response
      case 'good':
        return 4 // Correct with hesitation
      case 'hard':
        return 3 // Correct with difficulty
      default:
        return 4
    }
  }

  // Get optimal study order
  static getOptimalStudyOrder(cards: SRSCard[]): SRSCard[] {
    const dueCards = this.getCardsForReview(cards)
    
    // Sort by: failed cards first, then by due time, then by ease (harder cards first)
    return dueCards.sort((a, b) => {
      // Cards with lapses (failed before) get priority
      if (a.lapses !== b.lapses) {
        return b.lapses - a.lapses
      }
      
      // Then by how overdue they are
      if (a.nextReview !== b.nextReview) {
        return a.nextReview - b.nextReview
      }
      
      // Finally by ease (harder cards first)
      return a.ease - b.ease
    })
  }
}