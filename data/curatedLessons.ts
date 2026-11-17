import { LessonPlan } from '@/types/tutor';

export const CURATED_LESSONS: Record<string, LessonPlan> = {
  'transformers-attention': {
    id: 'transformers-attention',
    topic: 'Transformers & Self-Attention: The Engine of Modern AI',
    subject: 'Artificial Intelligence & Deep Learning',
    difficulty: 'Intermediate',
    overview: 'Understand how self-attention transformed natural language processing by computing dynamic relevance between every word in parallel.',
    totalDuration: 120,
    suggestedQuestions: [
      'Why do we divide by the square root of d_k in the attention formula?',
      'How does Multi-Head Attention differ from single-head attention?',
      'Can you show me a concrete numerical example with Query and Key vectors?',
      'Why can Transformers process sentences in parallel while RNNs cannot?'
    ],
    beats: [
      {
        id: 'beat-1',
        beatIndex: 1,
        title: 'The Sequential Bottleneck of Old AI',
        summary: 'How earlier RNNs struggled with long-range dependencies.',
        duration: 24,
        startTime: 0,
        keyConcept: 'Sequential processing vs. Direct connections',
        narration: "Welcome! Before Transformers arrived in 2017, neural networks processed text sequentially, word by word, using Recurrent Neural Networks. As a sentence grew longer, information from earlier words faded away like a game of telephone. Notice on the board how each word had to pass through every intermediate step. Transformers solved this fundamentally by discarding sequential steps entirely and allowing every single word to communicate directly with every other word at the exact same instant.",
        actions: [
          {
            id: 'clear-1',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'title-1',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'TRANSFORMERS & SELF-ATTENTION MECHANISM',
            subtitle: 'Beat 1: The Sequential Bottleneck vs. Direct All-to-All Attention',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'rnn-box-1',
            type: 'card',
            timeOffset: 2,
            x: 60,
            y: 100,
            width: 140,
            height: 80,
            text: 'Word 1: "The"',
            subtitle: 'Hidden State h1',
            color: '#64748b',
            fill: '#1e293b'
          },
          {
            id: 'rnn-arrow-1',
            type: 'draw_arrow',
            timeOffset: 4,
            x: 200,
            y: 140,
            toX: 280,
            toY: 140,
            color: '#ef4444',
            text: 'Signal Loss'
          },
          {
            id: 'rnn-box-2',
            type: 'card',
            timeOffset: 5,
            x: 280,
            y: 100,
            width: 140,
            height: 80,
            text: 'Word 2: "bank"',
            subtitle: 'Hidden State h2',
            color: '#64748b',
            fill: '#1e293b'
          },
          {
            id: 'rnn-arrow-2',
            type: 'draw_arrow',
            timeOffset: 7,
            x: 420,
            y: 140,
            toX: 500,
            toY: 140,
            color: '#ef4444',
            text: 'Bottleneck'
          },
          {
            id: 'rnn-box-3',
            type: 'card',
            timeOffset: 8,
            x: 500,
            y: 100,
            width: 140,
            height: 80,
            text: 'Word 3: "river"',
            subtitle: 'Context faded!',
            color: '#f87171',
            fill: '#2a1215'
          },
          {
            id: 'laser-1',
            type: 'laser_pointer',
            timeOffset: 9,
            x: 570,
            y: 140
          },
          {
            id: 'transformer-solution-card',
            type: 'card',
            timeOffset: 14,
            x: 60,
            y: 220,
            width: 760,
            height: 140,
            text: '🚀 The Transformer Breakthrough: Direct Parallel Attention',
            subtitle: 'Every token looks directly at every other token in O(1) sequential depth with full context retention.',
            color: '#34d399',
            fill: '#064e3b',
            badge: 'Key Innovation'
          },
          {
            id: 'direct-conn-arrow',
            type: 'draw_arrow',
            timeOffset: 18,
            x: 130,
            y: 180,
            toX: 570,
            toY: 180,
            color: '#10b981',
            dashed: true,
            text: 'Direct Context Link (O(1) distance)'
          }
        ]
      },
      {
        id: 'beat-2',
        beatIndex: 2,
        title: 'The Intuition: Queries, Keys, and Values',
        summary: 'How tokens query each other like a database search.',
        duration: 25,
        startTime: 24,
        keyConcept: 'Database retrieval analogy: Q, K, and V vectors',
        narration: "To understand how self-attention works mechanically, imagine a database search. For every word, the neural network generates three distinct vectors: a Query, a Key, and a Value. Think of the Query as a question: 'What other words provide context for me?' The Key is an address tag: 'Here is what information I contain.' When a Query takes the dot product with a Key, it calculates an attention score. High similarity means high relevance, deciding how much of that word's Value vector to pull into the final representation.",
        actions: [
          {
            id: 'clear-2',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'title-2',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'THE THREE VECTORS: QUERY, KEY & VALUE',
            subtitle: 'Beat 2: The Universal Information Retrieval Framework',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'q-card',
            type: 'card',
            timeOffset: 2,
            x: 70,
            y: 110,
            width: 220,
            height: 150,
            text: '🔍 Query Vector (Q)',
            subtitle: '"What am I looking for?"\nGenerated by the current word to probe the rest of the sentence.',
            color: '#f59e0b',
            fill: '#451a03',
            badge: 'Probe'
          },
          {
            id: 'laser-q',
            type: 'laser_pointer',
            timeOffset: 5,
            x: 180,
            y: 185
          },
          {
            id: 'k-card',
            type: 'card',
            timeOffset: 8,
            x: 340,
            y: 110,
            width: 220,
            height: 150,
            text: '🏷️ Key Vector (K)',
            subtitle: '"What identity do I advertise?"\nUsed to match against queries via dot-product similarity.',
            color: '#06b6d4',
            fill: '#083344',
            badge: 'Tag'
          },
          {
            id: 'laser-k',
            type: 'laser_pointer',
            timeOffset: 12,
            x: 450,
            y: 185
          },
          {
            id: 'v-card',
            type: 'card',
            timeOffset: 14,
            x: 610,
            y: 110,
            width: 220,
            height: 150,
            text: '📦 Value Vector (V)',
            subtitle: '"What content do I provide?"\nThe actual semantic content blended based on attention weights.',
            color: '#a855f7',
            fill: '#3b0764',
            badge: 'Payload'
          },
          {
            id: 'interaction-arrow',
            type: 'draw_arrow',
            timeOffset: 18,
            x: 290,
            y: 185,
            toX: 340,
            toY: 185,
            color: '#fbbf24',
            text: 'Q · K^T'
          },
          {
            id: 'sticky-analogy',
            type: 'sticky_note',
            timeOffset: 21,
            x: 180,
            y: 290,
            width: 530,
            height: 80,
            text: '💡 Mental Model: YouTube Search! Your search query (Q) matches video titles/tags (K) to return the best video contents (V).'
          }
        ]
      },
      {
        id: 'beat-3',
        beatIndex: 3,
        title: 'The Scaled Dot-Product Attention Equation',
        summary: 'Deconstructing the mathematical formula step by step.',
        duration: 26,
        startTime: 49,
        keyConcept: 'Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V',
        narration: "Here is the exact formula that powers ChatGPT and modern large language models. First, we compute Q times K transpose, measuring the raw compatibility between every token pair. Next, we divide by the square root of d sub k. Why? Because in high dimensions, dot products grow large, pushing softmax into flat gradient regions with vanishing gradients. Dividing keeps gradients healthy. Finally, softmax normalizes scores into probabilities that sum to 1, and we calculate a weighted sum of the Values.",
        actions: [
          {
            id: 'clear-3',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'title-3',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'THE SCALED DOT-PRODUCT ATTENTION FORMULA',
            subtitle: 'Beat 3: Mathematical Precision Behind the Magic',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'formula-main',
            type: 'card',
            timeOffset: 2,
            x: 80,
            y: 95,
            width: 720,
            height: 90,
            text: 'Attention(Q, K, V) = Softmax(  (Q · Kᵀ) / √dₖ  ) · V',
            subtitle: 'Scaled dot-product attention as introduced by Vaswani et al. (2017)',
            color: '#ec4899',
            fill: '#500724',
            fontSize: 22
          },
          {
            id: 'laser-formula',
            type: 'laser_pointer',
            timeOffset: 4,
            x: 440,
            y: 140
          },
          {
            id: 'step-1-card',
            type: 'card',
            timeOffset: 7,
            x: 80,
            y: 210,
            width: 220,
            height: 160,
            text: '1. Dot Product (Q · Kᵀ)',
            subtitle: 'Matrix multiplication calculates compatibility scores across all word pairs simultaneously.',
            color: '#38bdf8',
            fill: '#0c4a6e'
          },
          {
            id: 'step-2-card',
            type: 'card',
            timeOffset: 12,
            x: 330,
            y: 210,
            width: 220,
            height: 160,
            text: '2. Scaling Factor (√dₖ)',
            subtitle: 'Prevents extremely large values that would saturate softmax and cause zero gradients during backprop!',
            color: '#fbbf24',
            fill: '#713f12',
            badge: 'Critical Math'
          },
          {
            id: 'laser-scaling',
            type: 'laser_pointer',
            timeOffset: 15,
            x: 440,
            y: 290
          },
          {
            id: 'step-3-card',
            type: 'card',
            timeOffset: 18,
            x: 580,
            y: 210,
            width: 220,
            height: 160,
            text: '3. Softmax & Blend (· V)',
            subtitle: 'Normalizes into positive probabilities (0 to 1) summing to 100%, then outputs weighted sum of Values.',
            color: '#34d399',
            fill: '#064e3b'
          }
        ]
      },
      {
        id: 'beat-4',
        beatIndex: 4,
        title: 'Multi-Head Attention: Diverse Perspectives',
        summary: 'How multiple attention heads specialize in syntax, semantics, and reference.',
        duration: 25,
        startTime: 75,
        keyConcept: 'Parallel representation subspaces',
        narration: "A single attention head can only focus on one relationship at a time. That is why modern models use Multi-Head Attention. Look at how the sentence 'The animal didn't cross the street because it was too tired' is processed. Head 1 learns grammatical syntax. Head 2 learns coreference resolution—connecting the pronoun 'it' directly to 'animal' rather than 'street'. Having multiple heads running in parallel gives the model multiple cognitive lenses simultaneously.",
        actions: [
          {
            id: 'clear-4',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'title-4',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'MULTI-HEAD ATTENTION: PARALLEL LENSES',
            subtitle: 'Beat 4: Specialization in Grammatical and Semantic Relationships',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'sentence-box',
            type: 'card',
            timeOffset: 2,
            x: 80,
            y: 90,
            width: 720,
            height: 60,
            text: '"The animal didn\'t cross the street because IT was too tired."',
            subtitle: 'Example of pronoun coreference ambiguity solved by self-attention.',
            color: '#f8fafc',
            fill: '#334155'
          },
          {
            id: 'head-1',
            type: 'card',
            timeOffset: 6,
            x: 80,
            y: 180,
            width: 220,
            height: 180,
            text: '🔵 Head 1: Syntactic',
            subtitle: 'Links verbs to direct objects.\nConnects "cross" ↔ "street".\nIdentifies grammatical structure.',
            color: '#60a5fa',
            fill: '#1e3a8a'
          },
          {
            id: 'head-2',
            type: 'card',
            timeOffset: 11,
            x: 330,
            y: 180,
            width: 220,
            height: 180,
            text: '🟢 Head 2: Coreference',
            subtitle: 'Resolves ambiguous pronouns!\nStrong weight connecting "IT" ↔ "ANIMAL" because animals get tired.',
            color: '#34d399',
            fill: '#064e3b',
            badge: 'Key Link'
          },
          {
            id: 'laser-head2',
            type: 'laser_pointer',
            timeOffset: 14,
            x: 440,
            y: 270
          },
          {
            id: 'head-3',
            type: 'card',
            timeOffset: 18,
            x: 580,
            y: 180,
            width: 220,
            height: 180,
            text: '🟣 Head 3: Positional',
            subtitle: 'Tracks local word adjacencies and positional order in the sequence.',
            color: '#c084fc',
            fill: '#581c87'
          }
        ]
      },
      {
        id: 'beat-5',
        beatIndex: 5,
        title: 'Summary & Modern Impact',
        summary: 'Key takeaways and why Transformers dominate modern AI.',
        duration: 20,
        startTime: 100,
        keyConcept: 'Foundation of modern LLMs, Vision Transformers, and beyond',
        narration: "To wrap up: Self-attention replaced slow sequential recurrence with parallel all-to-all token matching using Queries, Keys, and Values. Scaled dot products compute relevance probabilities, and multi-head attention captures multiple nuances simultaneously. This revolutionary mechanism powers GPT-4, Gemini, Claude, and modern vision models. Try asking me a follow-up question in the chat or click any element on the whiteboard to explore further!",
        actions: [
          {
            id: 'clear-5',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'title-5',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'LESSON COMPLETE: CORE ARCHITECTURAL SUMMARY',
            subtitle: 'Beat 5: The Pillars of Modern AI Architecture',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#34d399'
          },
          {
            id: 'summary-card-1',
            type: 'card',
            timeOffset: 2,
            x: 70,
            y: 100,
            width: 350,
            height: 120,
            text: '⚡ Massive Parallelization',
            subtitle: 'Replaced O(N) sequential steps with O(1) constant depth, unleashing GPU training at planetary scale.',
            color: '#38bdf8',
            fill: '#075985'
          },
          {
            id: 'summary-card-2',
            type: 'card',
            timeOffset: 5,
            x: 460,
            y: 100,
            width: 350,
            height: 120,
            text: '🧠 Dynamic All-to-All Context',
            subtitle: 'Words dynamically attend to relevant context regardless of physical distance in the prompt.',
            color: '#a855f7',
            fill: '#581c87'
          },
          {
            id: 'summary-card-3',
            type: 'card',
            timeOffset: 8,
            x: 70,
            y: 240,
            width: 740,
            height: 110,
            text: '🎓 What will you explore next?',
            subtitle: 'Ask a follow-up question below, e.g. "Explain the role of positional encoding" or "Show me a numerical attention calculation".',
            color: '#facc15',
            fill: '#713f12',
            badge: 'Interactive Follow-up'
          },
          {
            id: 'laser-finish',
            type: 'laser_pointer',
            timeOffset: 12,
            x: 440,
            y: 295
          }
        ]
      }
    ]
  },

  'binary-search-trees': {
    id: 'binary-search-trees',
    topic: 'Binary Search Trees & Logarithmic Search',
    subject: 'Computer Science & Data Structures',
    difficulty: 'Beginner',
    overview: 'Learn how tree structures enable O(log N) search, insertion, and deletion by halving the search space at every step.',
    totalDuration: 120,
    suggestedQuestions: [
      'What happens to a BST if we insert elements in already sorted order?',
      'How does an AVL Tree automatically rebalance itself?',
      'Can you show me an in-order traversal of this tree?',
      'How does BST lookup compare with Hash Tables in memory and speed?'
    ],
    beats: [
      {
        id: 'bst-b1',
        beatIndex: 1,
        title: 'The Problem with Linear Arrays',
        summary: 'Why scanning every element one-by-one fails at scale.',
        duration: 24,
        startTime: 0,
        keyConcept: 'Linear O(N) vs logarithmic O(log N) efficiency',
        narration: "Welcome! Imagine searching for a specific name in a phone book of one million people. If you start on page one and read every name one by one, that is linear search—O of N. In the worst case, you would check one million entries. But humans do not read phone books linearly; we open directly to the middle, decide if our target comes earlier or later, and eliminate half the book instantly. That divide-and-conquer strategy is the foundational magic of Binary Search Trees.",
        actions: [
          {
            id: 'bst-c1',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'bst-t1',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'BINARY SEARCH TREES: THE POWER OF LOGARITHMS',
            subtitle: 'Beat 1: Linear Search O(N) vs Divide & Conquer O(log N)',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'array-visual',
            type: 'card',
            timeOffset: 2,
            x: 60,
            y: 110,
            width: 760,
            height: 90,
            text: 'Unsorted Array: [14, 82, 3, 99, 45, 12, 67, 33, 58, 21]',
            subtitle: 'Searching for 58 requires checking every element one by one. O(N) worst case: 1,000,000 checks for 1M items!',
            color: '#ef4444',
            fill: '#450a0a',
            badge: 'O(N) Slow'
          },
          {
            id: 'bst-concept-card',
            type: 'card',
            timeOffset: 9,
            x: 60,
            y: 225,
            width: 760,
            height: 120,
            text: '⚡ Divide & Conquer: Halving the Space Each Step',
            subtitle: 'With each comparison, we throw away 50% of the remaining search space. For 1,000,000 items, log₂(1,000,000) is only ~20 comparisons!',
            color: '#10b981',
            fill: '#064e3b',
            badge: 'O(log N) Fast'
          },
          {
            id: 'laser-bst-1',
            type: 'laser_pointer',
            timeOffset: 12,
            x: 440,
            y: 285
          }
        ]
      },
      {
        id: 'bst-b2',
        beatIndex: 2,
        title: 'The Binary Search Tree Invariant',
        summary: 'The golden rule: Left child < Node < Right child.',
        duration: 25,
        startTime: 24,
        keyConcept: 'Left < Root < Right structural invariant',
        narration: "A Binary Search Tree is a hierarchical data structure governed by one strict invariant rule. For every node with value X: every single value in its left subtree must be strictly less than X, and every value in its right subtree must be strictly greater than X. Look at our tree on the board: root node 50 has 30 on the left, and 70 on the right. This structural invariant holds true recursively at every single branch.",
        actions: [
          {
            id: 'bst-c2',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'bst-t2',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'THE BST INVARIANT: LEFT < PARENT < RIGHT',
            subtitle: 'Beat 2: The Recursive Structural Guarantee',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'node-root',
            type: 'draw_circle',
            timeOffset: 2,
            x: 440,
            y: 120,
            radius: 32,
            text: '50',
            subtitle: 'Root Node',
            color: '#fbbf24',
            fill: '#713f12'
          },
          {
            id: 'laser-bst-root',
            type: 'laser_pointer',
            timeOffset: 4,
            x: 440,
            y: 120
          },
          {
            id: 'arr-left',
            type: 'draw_arrow',
            timeOffset: 6,
            x: 420,
            y: 150,
            toX: 280,
            toY: 220,
            color: '#38bdf8',
            text: 'Values < 50'
          },
          {
            id: 'node-left',
            type: 'draw_circle',
            timeOffset: 8,
            x: 260,
            y: 240,
            radius: 30,
            text: '30',
            color: '#38bdf8',
            fill: '#0c4a6e'
          },
          {
            id: 'arr-right',
            type: 'draw_arrow',
            timeOffset: 10,
            x: 460,
            y: 150,
            toX: 600,
            toY: 220,
            color: '#34d399',
            text: 'Values > 50'
          },
          {
            id: 'node-right',
            type: 'draw_circle',
            timeOffset: 12,
            x: 620,
            y: 240,
            radius: 30,
            text: '70',
            color: '#34d399',
            fill: '#064e3b'
          },
          {
            id: 'invariant-rule-box',
            type: 'card',
            timeOffset: 16,
            x: 100,
            y: 310,
            width: 680,
            height: 60,
            text: '✨ Rule: In-Order Traversal (Left → Root → Right) always produces sorted output!',
            subtitle: 'Example traversal here: [30, 50, 70] in strictly ascending order.',
            color: '#e879f9',
            fill: '#4a044e'
          }
        ]
      },
      {
        id: 'bst-b3',
        beatIndex: 3,
        title: 'Step-by-Step Search Algorithm',
        summary: 'Walking down the tree to find target key 35.',
        duration: 25,
        startTime: 49,
        keyConcept: 'Tree traversal decisions: O(h) where h is height',
        narration: "Let us walk through a live search together. Suppose we want to search for the number 35. We start at root 50. Is 35 equal to 50? No, 35 is less than 50, so we navigate down the left child to node 30. Now, compare 35 with 30: 35 is greater than 30, so we turn right! We land on node 35. Match found in just two comparisons! Notice how we completely bypassed the entire right half of the tree containing 70 and its children.",
        actions: [
          {
            id: 'bst-c3',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'bst-t3',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'SEARCH WALKTHROUGH: FINDING KEY = 35',
            subtitle: 'Beat 3: Watch the Path Trace Down the Branches',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'search-root',
            type: 'draw_circle',
            timeOffset: 1,
            x: 440,
            y: 110,
            radius: 28,
            text: '50',
            color: '#fbbf24',
            fill: '#713f12'
          },
          {
            id: 'step-1-inspect',
            type: 'highlight',
            timeOffset: 3,
            x: 400,
            y: 75,
            width: 80,
            height: 70,
            color: '#f59e0b',
            text: 'Step 1: 35 < 50 → GO LEFT'
          },
          {
            id: 'laser-step1',
            type: 'laser_pointer',
            timeOffset: 5,
            x: 440,
            y: 110
          },
          {
            id: 'path-arrow-1',
            type: 'draw_arrow',
            timeOffset: 7,
            x: 420,
            y: 135,
            toX: 280,
            toY: 195,
            color: '#38bdf8',
            strokeWidth: 4
          },
          {
            id: 'search-n2',
            type: 'draw_circle',
            timeOffset: 8,
            x: 260,
            y: 215,
            radius: 28,
            text: '30',
            color: '#38bdf8',
            fill: '#0c4a6e'
          },
          {
            id: 'step-2-inspect',
            type: 'highlight',
            timeOffset: 10,
            x: 220,
            y: 180,
            width: 80,
            height: 70,
            color: '#38bdf8',
            text: 'Step 2: 35 > 30 → GO RIGHT'
          },
          {
            id: 'path-arrow-2',
            type: 'draw_arrow',
            timeOffset: 13,
            x: 280,
            y: 235,
            toX: 340,
            toY: 285,
            color: '#34d399',
            strokeWidth: 4
          },
          {
            id: 'search-target',
            type: 'draw_circle',
            timeOffset: 15,
            x: 355,
            y: 305,
            radius: 28,
            text: '35',
            color: '#34d399',
            fill: '#064e3b'
          },
          {
            id: 'laser-found',
            type: 'laser_pointer',
            timeOffset: 17,
            x: 355,
            y: 305
          },
          {
            id: 'found-badge',
            type: 'card',
            timeOffset: 19,
            x: 460,
            y: 280,
            width: 320,
            height: 70,
            text: '🎯 KEY 35 LOCATED!',
            subtitle: 'Only 2 comparisons needed out of the entire tree.',
            color: '#34d399',
            fill: '#064e3b'
          }
        ]
      },
      {
        id: 'bst-b4',
        beatIndex: 4,
        title: 'The Degenerate Worst Case vs. Balanced Trees',
        summary: 'What happens when input arrives pre-sorted?',
        duration: 26,
        startTime: 74,
        keyConcept: 'Skewed tree degradation into linked list O(N) vs AVL balance',
        narration: "Here is the critical catch every software engineer must know. What happens if you insert numbers into a BST in ascending order: 10, then 20, then 30, then 40? Every new node is greater than the previous one, so it always attaches to the right! The tree degenerates into a flat, tilted linked list with height N. Search time collapses back to O of N. To fix this, self-balancing trees like AVL and Red-Black trees perform automatic tree rotations to guarantee O of log N height.",
        actions: [
          {
            id: 'bst-c4',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'bst-t4',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'DEGENERATE SKEWED TREE VS. BALANCED TREE',
            subtitle: 'Beat 4: Why Tree Height Dictates Real-World Performance',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'bad-tree-card',
            type: 'card',
            timeOffset: 2,
            x: 60,
            y: 90,
            width: 360,
            height: 270,
            text: '⚠️ Degenerate Tree: O(N) Nightmare',
            subtitle: 'Occurs with pre-sorted input [10, 20, 30, 40, 50].\nBecomes a glorified linked list.\nTree Height = N.\nLookups take linear time!',
            color: '#f87171',
            fill: '#450a0a',
            badge: 'Worst Case'
          },
          {
            id: 'good-tree-card',
            type: 'card',
            timeOffset: 12,
            x: 460,
            y: 90,
            width: 360,
            height: 270,
            text: '🛡️ Self-Balancing: AVL & Red-Black',
            subtitle: 'Uses tree rotations (Left/Right rotations).\nGuarantees height ≤ 1.44 · log₂(N).\nPreserves strict O(log N) lookup, insertion, and deletion guarantees.',
            color: '#34d399',
            fill: '#064e3b',
            badge: 'Production Grade'
          },
          {
            id: 'laser-balanced',
            type: 'laser_pointer',
            timeOffset: 16,
            x: 640,
            y: 225
          }
        ]
      },
      {
        id: 'bst-b5',
        beatIndex: 5,
        title: 'Summary & Real-World Systems',
        summary: 'Where BST concepts live: databases, file systems, and sets.',
        duration: 20,
        startTime: 100,
        keyConcept: 'B-Trees in Postgres, MySQL, SQLite, and Linux ext4',
        narration: "To conclude: Binary Search Trees organize data so that every left step goes smaller and every right step goes larger, yielding logarithmic performance. Production databases like PostgreSQL and MySQL extend this concept to multi-way B-Trees to index terabytes on disk with minimal disk reads. Feel free to ask a follow-up question below, or ask me to show an AVL rotation live on the board!",
        actions: [
          {
            id: 'bst-c5',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'bst-t5',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'BST LESSON SUMMARY: WHERE IS THIS USED?',
            subtitle: 'Beat 5: From Foundations to Production Systems',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#34d399'
          },
          {
            id: 'usecase-1',
            type: 'card',
            timeOffset: 2,
            x: 70,
            y: 100,
            width: 350,
            height: 120,
            text: '🗄️ Database B-Tree Indexing',
            subtitle: 'Postgres, MySQL, and SQLite use generalized multi-way BSTs (B+Trees) for fast indexed column queries.',
            color: '#38bdf8',
            fill: '#075985'
          },
          {
            id: 'usecase-2',
            type: 'card',
            timeOffset: 5,
            x: 460,
            y: 100,
            width: 350,
            height: 120,
            text: '🗺️ Sorted Sets & Maps in Memory',
            subtitle: "C++ `std::map` and Java `TreeMap` are backed by Red-Black Balanced BSTs under the hood.",
            color: '#a855f7',
            fill: '#581c87'
          },
          {
            id: 'bst-cta',
            type: 'card',
            timeOffset: 8,
            x: 70,
            y: 240,
            width: 740,
            height: 110,
            text: '💬 What would you like to explore next?',
            subtitle: 'Ask in chat: "How does a tree rotation work?", "Quiz me on BST complexity", or "Compare BST with a Hash Map".',
            color: '#facc15',
            fill: '#713f12',
            badge: 'Ask the AI Tutor'
          },
          {
            id: 'laser-bst-end',
            type: 'laser_pointer',
            timeOffset: 12,
            x: 440,
            y: 295
          }
        ]
      }
    ]
  },

  'quantum-superposition': {
    id: 'quantum-superposition',
    topic: 'Quantum Superposition & Entanglement: Beyond Classical Bits',
    subject: 'Quantum Physics & Quantum Computing',
    difficulty: 'Advanced',
    overview: 'Discover how qubits exist in linear combinations of states, collapse upon measurement, and entangle across distance.',
    totalDuration: 120,
    suggestedQuestions: [
      'What is the physical meaning of the probability amplitudes alpha and beta?',
      'Does quantum entanglement allow faster-than-light communication?',
      'How does the Hadamard gate create superposition from state |0>?',
      'What causes quantum decoherence in physical quantum computers?'
    ],
    beats: [
      {
        id: 'qp-b1',
        beatIndex: 1,
        title: 'Classical Bits vs. The Quantum Qubit',
        summary: 'How a qubit breaks the binary 0-or-1 limitation.',
        duration: 24,
        startTime: 0,
        keyConcept: 'Binary deterministic states vs. Quantum state sphere',
        narration: "Welcome to the quantum realm! In classical computing, every piece of information is stored as a bit: a physical voltage that is either strictly zero or strictly one. Like a coin resting flat on a table, it has to be either heads or tails. A quantum bit, or qubit, is fundamentally different. While unmeasured, a qubit behaves like a coin spinning on the table. It simultaneously exhibits properties of both zero and one at the same time in a state called quantum superposition.",
        actions: [
          {
            id: 'qp-c1',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'qp-t1',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'QUANTUM SUPERPOSITION: BEYOND BINARY BITS',
            subtitle: 'Beat 1: The Classical Binary Switch vs The Spinning Quantum Qubit',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'classical-bit-card',
            type: 'card',
            timeOffset: 2,
            x: 80,
            y: 110,
            width: 330,
            height: 180,
            text: '🪙 Classical Bit: Binary',
            subtitle: 'Deterministic.\nValue ∈ {0, 1}.\nLike a coin resting flat on a desk:\nHeads OR Tails.',
            color: '#94a3b8',
            fill: '#1e293b',
            badge: 'Classical'
          },
          {
            id: 'qubit-card',
            type: 'card',
            timeOffset: 7,
            x: 470,
            y: 110,
            width: 330,
            height: 180,
            text: '⚛️ Quantum Qubit: Superposition',
            subtitle: 'Probabilistic continuous state.\nLinear combination |ψ⟩ = α|0⟩ + β|1⟩.\nLike a spinning coin:\nBoth 0 AND 1 until observed!',
            color: '#c084fc',
            fill: '#3b0764',
            badge: 'Quantum'
          },
          {
            id: 'laser-qubit-1',
            type: 'laser_pointer',
            timeOffset: 12,
            x: 635,
            y: 200
          },
          {
            id: 'analogy-banner',
            type: 'sticky_note',
            timeOffset: 18,
            x: 120,
            y: 310,
            width: 640,
            height: 60,
            text: '🌀 A qubit is not hiding a secret 0 or 1. It is genuinely in a linear combination of both states until measured!'
          }
        ]
      },
      {
        id: 'qp-b2',
        beatIndex: 2,
        title: 'The Math: State Vectors & The Bloch Sphere',
        summary: 'Visualizing qubits on a 3D unit sphere.',
        duration: 25,
        startTime: 24,
        keyConcept: '|ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1',
        narration: "Mathematically, we write the state of a qubit as ket psi equals alpha ket zero plus beta ket one. Alpha and beta are complex numbers called probability amplitudes. According to the Born rule, the probability of finding the qubit in state zero when measured is the magnitude of alpha squared, and state one is beta squared. Because probabilities must total 100 percent, alpha squared plus beta squared always equals one. We visualize this entire continuous state space geometrically as the Bloch Sphere.",
        actions: [
          {
            id: 'qp-c2',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'qp-t2',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'STATE VECTORS & THE BLOCH SPHERE',
            subtitle: 'Beat 2: Mathematical Rigor & Continuous State Spaces',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'bloch-formula',
            type: 'card',
            timeOffset: 2,
            x: 70,
            y: 95,
            width: 740,
            height: 90,
            text: '|ψ⟩ = α|0⟩ + β|1⟩    where    |α|² + |β|² = 1',
            subtitle: 'The fundamental quantum state equation and normalization condition',
            color: '#ec4899',
            fill: '#500724',
            fontSize: 22
          },
          {
            id: 'laser-bloch-eq',
            type: 'laser_pointer',
            timeOffset: 4,
            x: 440,
            y: 140
          },
          {
            id: 'prob-0-card',
            type: 'card',
            timeOffset: 8,
            x: 70,
            y: 205,
            width: 350,
            height: 155,
            text: 'Probability of |0⟩ = |α|²',
            subtitle: 'Amplitude α governs the likelihood that measurement collapses the qubit into classical state 0.',
            color: '#38bdf8',
            fill: '#0c4a6e'
          },
          {
            id: 'prob-1-card',
            type: 'card',
            timeOffset: 12,
            x: 460,
            y: 205,
            width: 350,
            height: 155,
            text: 'Probability of |1⟩ = |β|²',
            subtitle: 'Amplitude β governs the likelihood that measurement collapses the qubit into classical state 1.',
            color: '#a855f7',
            fill: '#3b0764'
          },
          {
            id: 'laser-amplitudes',
            type: 'laser_pointer',
            timeOffset: 16,
            x: 635,
            y: 280
          }
        ]
      },
      {
        id: 'qp-b3',
        beatIndex: 3,
        title: 'Wavefunction Collapse Upon Measurement',
        summary: 'How observing a quantum state forces reality to choose.',
        duration: 25,
        startTime: 49,
        keyConcept: 'Irreversible measurement collapse and non-determinism',
        narration: "What happens when you observe a qubit? In the classical world, measuring an object does not change its state. But in quantum mechanics, the very act of measurement collapses the wavefunction. Look at the board: as soon as the measuring apparatus interacts with the qubit, the delicate superposition snaps irreversibly into either pure zero or pure one. The amplitudes vanish, and the quantum advantage is converted into classical bits.",
        actions: [
          {
            id: 'qp-c3',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'qp-t3',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'THE MEASUREMENT POSTULATE: WAVEFUNCTION COLLAPSE',
            subtitle: 'Beat 3: Observation Forces Reality to Choose',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'pre-measure',
            type: 'card',
            timeOffset: 2,
            x: 80,
            y: 110,
            width: 250,
            height: 180,
            text: '✨ Superposition |ψ⟩',
            subtitle: '50% chance |0⟩\n50% chance |1⟩\nAll possibilities coexist in coherent harmony.',
            color: '#c084fc',
            fill: '#3b0764'
          },
          {
            id: 'measure-arrow',
            type: 'draw_arrow',
            timeOffset: 7,
            x: 340,
            y: 200,
            toX: 520,
            toY: 200,
            color: '#f43f5e',
            text: '👁️ Observation / Measurement',
            strokeWidth: 4
          },
          {
            id: 'laser-collapse',
            type: 'laser_pointer',
            timeOffset: 9,
            x: 430,
            y: 200
          },
          {
            id: 'collapsed-box',
            type: 'card',
            timeOffset: 12,
            x: 530,
            y: 110,
            width: 270,
            height: 180,
            text: '🎯 Definite Reality',
            subtitle: 'Snaps irreversibly to either:\n• State |0⟩ (classical bit 0)\nOR\n• State |1⟩ (classical bit 1)',
            color: '#34d399',
            fill: '#064e3b',
            badge: 'Irreversible'
          },
          {
            id: 'sticky-heisenberg',
            type: 'sticky_note',
            timeOffset: 18,
            x: 120,
            y: 310,
            width: 640,
            height: 60,
            text: '🔬 You cannot observe a quantum superposition without destroying it in the process!'
          }
        ]
      },
      {
        id: 'qp-b4',
        beatIndex: 4,
        title: 'Quantum Entanglement: Spooky Action',
        summary: 'Two particles sharing a single collective state.',
        duration: 26,
        startTime: 74,
        keyConcept: 'Bell State (|00⟩ + |11⟩) / √2',
        narration: "Now comes Einstein's famous 'spooky action at a distance'—quantum entanglement. When two qubits become entangled into a Bell state, their wavefunctions merge into a single mathematical entity. Even if you separate these two particles across opposite galaxies, measuring qubit A instantaneously determines the state of qubit B with 100% correlation. If qubit A collapses to zero, qubit B collapses to zero at that very instant.",
        actions: [
          {
            id: 'qp-c4',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'qp-t4',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'QUANTUM ENTANGLEMENT: EINSTEIN-PODOLSKY-ROSEN',
            subtitle: 'Beat 4: Non-Local Correlations Across Space',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#38bdf8'
          },
          {
            id: 'bell-card',
            type: 'card',
            timeOffset: 2,
            x: 80,
            y: 95,
            width: 720,
            height: 70,
            text: 'Bell State: |Φ⁺⟩ = ( |00⟩ + |11⟩ ) / √2',
            subtitle: 'The two qubits cannot be described independently—only as one unified system.',
            color: '#f59e0b',
            fill: '#78350f'
          },
          {
            id: 'particle-a',
            type: 'draw_circle',
            timeOffset: 6,
            x: 200,
            y: 250,
            radius: 35,
            text: 'Qubit A',
            subtitle: 'On Earth',
            color: '#38bdf8',
            fill: '#0c4a6e'
          },
          {
            id: 'entangled-beam',
            type: 'draw_arrow',
            timeOffset: 9,
            x: 240,
            y: 250,
            toX: 640,
            toY: 250,
            color: '#ec4899',
            dashed: true,
            text: '⚡ Instantaneous Quantum Correlation ⚡',
            strokeWidth: 3
          },
          {
            id: 'laser-beam',
            type: 'laser_pointer',
            timeOffset: 12,
            x: 440,
            y: 250
          },
          {
            id: 'particle-b',
            type: 'draw_circle',
            timeOffset: 14,
            x: 680,
            y: 250,
            radius: 35,
            text: 'Qubit B',
            subtitle: 'Light-years away',
            color: '#a855f7',
            fill: '#3b0764'
          },
          {
            id: 'correl-box',
            type: 'card',
            timeOffset: 18,
            x: 140,
            y: 310,
            width: 600,
            height: 60,
            text: 'Measure Qubit A = 0 ⟹ Qubit B instantly collapses to 0 with 100% certainty!',
            subtitle: 'No physical signal travels—it is a non-local correlation of quantum reality.',
            color: '#34d399',
            fill: '#064e3b'
          }
        ]
      },
      {
        id: 'qp-b5',
        beatIndex: 5,
        title: 'Summary & Quantum Supremacy',
        summary: 'Exponential scaling: N qubits represent 2^N states simultaneously.',
        duration: 20,
        startTime: 100,
        keyConcept: '2^N state vector dimensions powering quantum computing',
        narration: "To summarize: While N classical bits store only N bits of information, N entangled qubits in superposition exist in two to the power of N complex dimensions simultaneously. With just 300 qubits, the number of simultaneous states exceeds the total number of atoms in the observable universe! This exponential parallelism is why quantum computers will revolutionize materials science, molecular drug discovery, and cryptography. Ask me any follow-up question to dive deeper!",
        actions: [
          {
            id: 'qp-c5',
            type: 'clear',
            timeOffset: 0,
            x: 0,
            y: 0
          },
          {
            id: 'qp-t5',
            type: 'draw_text',
            timeOffset: 0.5,
            x: 50,
            y: 40,
            text: 'SUMMARY: THE QUANTUM COMPUTING REVOLUTION',
            subtitle: 'Beat 5: Exponential State Space and Next Horizons',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#34d399'
          },
          {
            id: 'scaling-card-1',
            type: 'card',
            timeOffset: 2,
            x: 70,
            y: 100,
            width: 350,
            height: 120,
            text: '📈 Exponential Scaling: 2ᴺ',
            subtitle: '50 qubits = 1.1 quadrillion simultaneous numbers.\n300 qubits > total atoms in the observable universe!',
            color: '#38bdf8',
            fill: '#075985'
          },
          {
            id: 'scaling-card-2',
            type: 'card',
            timeOffset: 5,
            x: 460,
            y: 100,
            width: 350,
            height: 120,
            text: '💊 Revolutionary Impact',
            subtitle: 'Simulating complex chemical bonds for life-saving drugs and room-temperature superconductors.',
            color: '#a855f7',
            fill: '#581c87'
          },
          {
            id: 'qp-cta',
            type: 'card',
            timeOffset: 8,
            x: 70,
            y: 240,
            width: 740,
            height: 110,
            text: '💬 Continue the Conversation!',
            subtitle: 'Ask in chat: "Can entanglement send signals faster than light?", "Explain the Hadamard gate", or click anywhere on the whiteboard.',
            color: '#facc15',
            fill: '#713f12',
            badge: 'Ask the AI Tutor'
          },
          {
            id: 'laser-qp-end',
            type: 'laser_pointer',
            timeOffset: 12,
            x: 440,
            y: 295
          }
        ]
      }
    ]
  }
};
