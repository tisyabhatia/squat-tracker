import { Exercise, WorkoutTemplate } from '../types';

// ==================== Exercise Library (50+ exercises) ====================

export const seedExercises: Exercise[] = [
  // ===== CHEST EXERCISES =====
  {
    id: 'ex-001',
    name: 'Barbell Bench Press',
    description: 'Classic compound chest exercise using a barbell on a flat bench',
    category: 'strength',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on bench with feet firmly on floor',
      'Grip bar slightly wider than shoulder width',
      'Lower bar to mid-chest with control',
      'Press bar up until arms are fully extended',
      'Keep shoulder blades retracted throughout'
    ],
    formTips: [
      'Keep your back slightly arched',
      'Drive through your heels',
      'Bar should travel in a slight arc'
    ],
    commonMistakes: [
      'Bouncing bar off chest',
      'Flaring elbows too wide',
      'Lifting hips off bench'
    ],
  },
  {
    id: 'ex-002',
    name: 'Dumbbell Bench Press',
    description: 'Chest exercise using dumbbells for greater range of motion',
    category: 'strength',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['dumbbell', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      'Sit on bench with dumbbells on thighs',
      'Lie back and position dumbbells at chest level',
      'Press dumbbells up until arms are extended',
      'Lower with control to chest level',
      'Repeat for desired reps'
    ],
    formTips: [
      'Allow dumbbells to go deeper than barbell range',
      'Keep wrists straight',
      'Control the weight throughout'
    ],
    commonMistakes: [
      'Using too much weight',
      'Twisting dumbbells at top',
      'Not going through full range'
    ],
  },
  {
    id: 'ex-003',
    name: 'Incline Bench Press',
    description: 'Targets upper chest with an inclined bench angle',
    category: 'strength',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      'Set bench to 30-45 degree incline',
      'Lie back and grip bar slightly wider than shoulders',
      'Unrack and lower bar to upper chest',
      'Press up until arms are extended',
      'Maintain control throughout movement'
    ],
    formTips: [
      'Optimal angle is 30-45 degrees',
      'Focus on upper chest contraction',
      'Keep core tight'
    ],
    commonMistakes: [
      'Setting bench too steep',
      'Letting bar drift too high',
      'Using momentum'
    ],
  },
  {
    id: 'ex-004',
    name: 'Push-Ups',
    description: 'Bodyweight chest exercise that can be done anywhere',
    category: 'strength',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders', 'abs'],
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Start in plank position with hands shoulder-width',
      'Lower body until chest nearly touches ground',
      'Keep core engaged and body straight',
      'Push back up to starting position',
      'Repeat for desired reps'
    ],
    formTips: [
      'Maintain straight line from head to heels',
      'Breathe in on the way down',
      'Elbows at 45-degree angle'
    ],
    commonMistakes: [
      'Sagging hips',
      'Flaring elbows out',
      'Not going low enough'
    ],
  },
  {
    id: 'ex-005',
    name: 'Dumbbell Flyes',
    description: 'Isolation exercise for chest stretch and contraction',
    category: 'strength',
    primaryMuscles: ['chest'],
    secondaryMuscles: [],
    equipment: ['dumbbell', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      'Lie on flat bench with dumbbells above chest',
      'With slight bend in elbows, lower weights to sides',
      'Feel stretch in chest',
      'Bring weights back together above chest',
      'Squeeze chest at top'
    ],
    formTips: [
      'Keep elbows slightly bent throughout',
      'Focus on the squeeze',
      'Use lighter weight than presses'
    ],
    commonMistakes: [
      'Using too much weight',
      'Bending elbows too much (turning into press)',
      'Going too deep and straining shoulders'
    ],
  },

  // ===== BACK EXERCISES =====
  {
    id: 'ex-006',
    name: 'Deadlift',
    description: 'King of compound movements, works entire posterior chain',
    category: 'strength',
    primaryMuscles: ['back', 'glutes', 'hamstrings'],
    secondaryMuscles: ['forearms', 'abs', 'quadriceps'],
    equipment: ['barbell'],
    difficulty: 'advanced',
    instructions: [
      'Stand with feet hip-width, bar over mid-foot',
      'Grip bar just outside legs',
      'Keep back straight, chest up',
      'Drive through heels to stand up',
      'Lower bar with control'
    ],
    formTips: [
      'Keep bar close to body',
      'Engage lats throughout',
      'Hinge at hips, not just bend knees'
    ],
    commonMistakes: [
      'Rounding back',
      'Bar drifting away from body',
      'Not engaging lats'
    ],
  },
  {
    id: 'ex-007',
    name: 'Pull-Ups',
    description: 'Bodyweight back builder, targets lats and upper back',
    category: 'strength',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: ['pull-up-bar'],
    difficulty: 'intermediate',
    instructions: [
      'Hang from bar with overhand grip, hands shoulder-width',
      'Pull body up until chin over bar',
      'Lower with control to full extension',
      'Keep core engaged throughout',
      'Avoid swinging or kipping'
    ],
    formTips: [
      'Think of pulling elbows down',
      'Squeeze shoulder blades together at top',
      'Full extension at bottom'
    ],
    commonMistakes: [
      'Using momentum/swinging',
      'Not going through full range',
      'Shrugging shoulders'
    ],
  },
  {
    id: 'ex-008',
    name: 'Bent Over Barbell Row',
    description: 'Fundamental rowing movement for back thickness',
    category: 'strength',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Bend at hips with slight knee bend',
      'Grip bar slightly wider than shoulders',
      'Pull bar to lower chest/upper abs',
      'Squeeze shoulder blades together',
      'Lower with control'
    ],
    formTips: [
      'Keep back flat, not rounded',
      'Row to lower rib area',
      'Lead with elbows'
    ],
    commonMistakes: [
      'Using too much weight and cheating',
      'Rounding back',
      'Not retracting shoulder blades'
    ],
  },
  {
    id: 'ex-009',
    name: 'Seated Cable Row',
    description: 'Cable machine row for constant tension on back muscles',
    category: 'strength',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps'],
    equipment: ['cable-machine'],
    difficulty: 'beginner',
    instructions: [
      'Sit at cable row station with feet on platform',
      'Grip handle with arms extended',
      'Pull handle to lower chest',
      'Squeeze shoulder blades together',
      'Extend arms to starting position'
    ],
    formTips: [
      'Keep torso upright',
      'Pull handle to lower chest area',
      'Feel the squeeze in your back'
    ],
    commonMistakes: [
      'Using too much momentum',
      'Leaning back excessively',
      'Not squeezing shoulder blades'
    ],
  },
  {
    id: 'ex-010',
    name: 'Lat Pulldown',
    description: 'Cable exercise for lat width and development',
    category: 'strength',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: ['cable-machine'],
    difficulty: 'beginner',
    instructions: [
      'Sit at lat pulldown station',
      'Grip bar wider than shoulders',
      'Pull bar down to upper chest',
      'Squeeze lats at bottom',
      'Return to starting position with control'
    ],
    formTips: [
      'Lean back slightly',
      'Pull with elbows, not hands',
      'Focus on lat contraction'
    ],
    commonMistakes: [
      'Pulling behind neck (risky)',
      'Using too much momentum',
      'Not achieving full contraction'
    ],
  },

  // ===== LEG EXERCISES =====
  {
    id: 'ex-011',
    name: 'Barbell Squat',
    description: 'King of leg exercises, fundamental compound movement',
    category: 'strength',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'abs', 'lower-back'],
    equipment: ['barbell', 'squat-rack'],
    difficulty: 'intermediate',
    instructions: [
      'Position bar on upper back (not neck)',
      'Stand with feet shoulder-width apart',
      'Descend by bending knees and hips',
      'Keep chest up and core tight',
      'Drive through heels to return to standing'
    ],
    formTips: [
      'Go to at least parallel depth',
      'Keep knees tracking over toes',
      'Maintain neutral spine'
    ],
    commonMistakes: [
      'Not going deep enough',
      'Knees caving inward',
      'Rounding lower back'
    ],
  },
  {
    id: 'ex-012',
    name: 'Romanian Deadlift',
    description: 'Hip hinge movement targeting hamstrings and glutes',
    category: 'strength',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['lower-back'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Hold bar with overhand grip at hip level',
      'Hinge at hips, pushing them back',
      'Lower bar along legs, keeping it close',
      'Feel stretch in hamstrings',
      'Drive hips forward to return to start'
    ],
    formTips: [
      'Keep slight knee bend',
      'Push hips back, don\'t just bend over',
      'Feel the hamstring stretch'
    ],
    commonMistakes: [
      'Bending knees too much (becomes deadlift)',
      'Rounding back',
      'Not pushing hips back enough'
    ],
  },
  {
    id: 'ex-013',
    name: 'Leg Press',
    description: 'Machine-based quad and glute builder',
    category: 'strength',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['cable-machine'],
    difficulty: 'beginner',
    instructions: [
      'Sit in leg press with back against pad',
      'Place feet shoulder-width on platform',
      'Lower weight by bending knees to 90 degrees',
      'Press through heels to extend legs',
      'Don\'t lock out knees completely'
    ],
    formTips: [
      'Keep lower back pressed against pad',
      'Full range of motion',
      'Control the negative'
    ],
    commonMistakes: [
      'Letting lower back round',
      'Locking out knees',
      'Going too heavy and using partial reps'
    ],
  },
  {
    id: 'ex-014',
    name: 'Walking Lunges',
    description: 'Dynamic single-leg exercise for quads and glutes',
    category: 'strength',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    instructions: [
      'Hold dumbbells at sides or barbell on back',
      'Step forward into lunge position',
      'Lower back knee toward ground',
      'Push through front heel to step forward',
      'Alternate legs with each step'
    ],
    formTips: [
      'Keep torso upright',
      'Don\'t let front knee pass toes',
      'Take controlled steps'
    ],
    commonMistakes: [
      'Leaning too far forward',
      'Taking too short steps',
      'Letting knee collapse inward'
    ],
  },
  {
    id: 'ex-015',
    name: 'Leg Curl',
    description: 'Isolation exercise for hamstrings',
    category: 'strength',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: [],
    equipment: ['cable-machine'],
    difficulty: 'beginner',
    instructions: [
      'Lie face down on leg curl machine',
      'Position pad on lower calves',
      'Curl legs up toward glutes',
      'Squeeze hamstrings at top',
      'Lower with control'
    ],
    formTips: [
      'Keep hips down on pad',
      'Full contraction at top',
      'Control the eccentric'
    ],
    commonMistakes: [
      'Lifting hips off pad',
      'Using momentum',
      'Not achieving full range'
    ],
  },
  {
    id: 'ex-016',
    name: 'Calf Raises',
    description: 'Targets calf muscles for lower leg development',
    category: 'strength',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Stand with balls of feet on elevated surface',
      'Hold dumbbells or use machine',
      'Lower heels below platform level',
      'Rise up on toes as high as possible',
      'Pause at top, then lower'
    ],
    formTips: [
      'Full range of motion is key',
      'Pause at top for contraction',
      'Control the descent'
    ],
    commonMistakes: [
      'Bouncing at bottom',
      'Not going through full range',
      'Using too much weight'
    ],
  },

  // ===== SHOULDER EXERCISES =====
  {
    id: 'ex-017',
    name: 'Overhead Press',
    description: 'Fundamental shoulder press for overall shoulder development',
    category: 'strength',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'abs'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Start with bar at shoulder height',
      'Press bar overhead to full extension',
      'Lock out arms at top',
      'Lower with control to shoulders',
      'Keep core tight throughout'
    ],
    formTips: [
      'Tuck chin to allow bar to pass',
      'Keep core braced',
      'Press slightly back, not forward'
    ],
    commonMistakes: [
      'Leaning back excessively',
      'Not locking out fully',
      'Poor core stability'
    ],
  },
  {
    id: 'ex-018',
    name: 'Lateral Raises',
    description: 'Isolation for side delts and shoulder width',
    category: 'strength',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Stand with dumbbells at sides',
      'Raise arms out to sides to shoulder height',
      'Keep slight bend in elbows',
      'Lower with control',
      'Repeat for reps'
    ],
    formTips: [
      'Lead with elbows, not hands',
      'Don\'t go above shoulder height',
      'Control the negative'
    ],
    commonMistakes: [
      'Using too much weight',
      'Swinging and using momentum',
      'Raising too high'
    ],
  },
  {
    id: 'ex-019',
    name: 'Front Raises',
    description: 'Targets front deltoids',
    category: 'strength',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Hold dumbbells in front of thighs',
      'Raise one or both arms forward to shoulder height',
      'Keep elbows slightly bent',
      'Lower with control',
      'Alternate or do both together'
    ],
    formTips: [
      'Don\'t lean back',
      'Strict form, no momentum',
      'Raise to shoulder height only'
    ],
    commonMistakes: [
      'Using momentum to swing weights up',
      'Going too high',
      'Leaning back'
    ],
  },
  {
    id: 'ex-020',
    name: 'Face Pulls',
    description: 'Rear delt and upper back exercise',
    category: 'strength',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['back'],
    equipment: ['cable-machine'],
    difficulty: 'beginner',
    instructions: [
      'Set cable at upper chest height with rope',
      'Pull rope toward face',
      'Separate hands as you pull',
      'Squeeze shoulder blades together',
      'Return to starting position'
    ],
    formTips: [
      'Pull high, toward forehead/top of head',
      'External rotation at end',
      'Focus on rear delts'
    ],
    commonMistakes: [
      'Pulling too low',
      'Not separating the rope',
      'Using too much weight'
    ],
  },

  // ===== ARM EXERCISES =====
  {
    id: 'ex-021',
    name: 'Barbell Bicep Curl',
    description: 'Classic bicep builder',
    category: 'strength',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: ['barbell'],
    difficulty: 'beginner',
    instructions: [
      'Stand with barbell at arm\'s length',
      'Curl bar up toward shoulders',
      'Keep elbows stationary',
      'Squeeze biceps at top',
      'Lower with control'
    ],
    formTips: [
      'Don\'t swing the weight',
      'Keep elbows at sides',
      'Control the eccentric'
    ],
    commonMistakes: [
      'Using momentum',
      'Moving elbows forward',
      'Not controlling the descent'
    ],
  },
  {
    id: 'ex-022',
    name: 'Dumbbell Bicep Curl',
    description: 'Dumbbell variation for bicep development',
    category: 'strength',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Stand with dumbbells at sides',
      'Curl weights up, rotating palms up',
      'Keep elbows stationary',
      'Squeeze at top',
      'Lower with control'
    ],
    formTips: [
      'Can do alternating or together',
      'Supinate (rotate) wrists as you curl',
      'Full range of motion'
    ],
    commonMistakes: [
      'Swinging weights',
      'Incomplete range of motion',
      'Using too much weight'
    ],
  },
  {
    id: 'ex-023',
    name: 'Hammer Curl',
    description: 'Neutral grip curl for biceps and forearms',
    category: 'strength',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Hold dumbbells with neutral grip (palms facing each other)',
      'Curl up toward shoulders',
      'Keep elbows at sides',
      'Squeeze at top',
      'Lower with control'
    ],
    formTips: [
      'Maintain neutral grip throughout',
      'Targets brachialis and forearms',
      'Strict form'
    ],
    commonMistakes: [
      'Rotating wrists',
      'Using momentum',
      'Not fully extending'
    ],
  },
  {
    id: 'ex-024',
    name: 'Tricep Dips',
    description: 'Bodyweight tricep exercise',
    category: 'strength',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: ['none'],
    difficulty: 'intermediate',
    instructions: [
      'Position on parallel bars or bench',
      'Lower body by bending elbows',
      'Go down until upper arms parallel to ground',
      'Push back up to starting position',
      'Keep core engaged'
    ],
    formTips: [
      'Lean forward for chest, upright for triceps',
      'Don\'t go too deep if shoulders hurt',
      'Can add weight when bodyweight becomes easy'
    ],
    commonMistakes: [
      'Going too deep and stressing shoulders',
      'Flaring elbows out too much',
      'Using momentum'
    ],
  },
  {
    id: 'ex-025',
    name: 'Overhead Tricep Extension',
    description: 'Isolation exercise for long head of triceps',
    category: 'strength',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Hold dumbbell overhead with both hands',
      'Lower weight behind head by bending elbows',
      'Keep upper arms stationary',
      'Extend arms to raise weight back up',
      'Squeeze triceps at top'
    ],
    formTips: [
      'Keep elbows pointed forward',
      'Full stretch at bottom',
      'Control the weight'
    ],
    commonMistakes: [
      'Letting elbows flare out',
      'Not getting full stretch',
      'Using too much weight'
    ],
  },
  {
    id: 'ex-026',
    name: 'Tricep Pushdown',
    description: 'Cable exercise for tricep isolation',
    category: 'strength',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: ['cable-machine'],
    difficulty: 'beginner',
    instructions: [
      'Stand at cable station with bar at chest height',
      'Push bar down until arms fully extended',
      'Keep elbows at sides',
      'Squeeze triceps at bottom',
      'Return to starting position with control'
    ],
    formTips: [
      'Keep upper arms stationary',
      'Full lockout at bottom',
      'Lean slightly forward'
    ],
    commonMistakes: [
      'Using too much weight and leaning',
      'Not fully extending',
      'Moving elbows'
    ],
  },

  // ===== CORE EXERCISES =====
  {
    id: 'ex-027',
    name: 'Plank',
    description: 'Isometric core strengthener',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['shoulders', 'glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Start in push-up position on forearms',
      'Keep body in straight line from head to heels',
      'Engage core and glutes',
      'Hold position for time',
      'Breathe normally'
    ],
    formTips: [
      'Don\'t let hips sag',
      'Don\'t raise hips too high',
      'Squeeze glutes'
    ],
    commonMistakes: [
      'Sagging hips',
      'Looking up (neck strain)',
      'Holding breath'
    ],
  },
  {
    id: 'ex-028',
    name: 'Bicycle Crunches',
    description: 'Dynamic ab exercise targeting obliques',
    category: 'core',
    primaryMuscles: ['abs', 'obliques'],
    secondaryMuscles: [],
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Lie on back with hands behind head',
      'Bring opposite elbow to opposite knee',
      'Extend other leg straight',
      'Alternate sides in cycling motion',
      'Keep core engaged throughout'
    ],
    formTips: [
      'Rotate through core, not just elbows',
      'Keep lower back pressed to floor',
      'Controlled movement'
    ],
    commonMistakes: [
      'Pulling on neck',
      'Going too fast',
      'Not rotating through core'
    ],
  },
  {
    id: 'ex-029',
    name: 'Russian Twists',
    description: 'Rotational core exercise for obliques',
    category: 'core',
    primaryMuscles: ['obliques', 'abs'],
    secondaryMuscles: [],
    equipment: ['medicine-ball'],
    difficulty: 'intermediate',
    instructions: [
      'Sit with knees bent, feet off ground',
      'Lean back slightly to engage core',
      'Hold weight at chest',
      'Rotate torso side to side',
      'Touch weight to ground beside each hip'
    ],
    formTips: [
      'Keep chest up',
      'Rotate through core',
      'Can keep feet on ground for easier variation'
    ],
    commonMistakes: [
      'Using only arms, not rotating core',
      'Rounding back too much',
      'Going too fast'
    ],
  },
  {
    id: 'ex-030',
    name: 'Hanging Leg Raises',
    description: 'Advanced ab exercise targeting lower abs',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['hip-flexors'],
    equipment: ['pull-up-bar'],
    difficulty: 'advanced',
    instructions: [
      'Hang from pull-up bar',
      'Keep legs straight or bent',
      'Raise legs up toward chest',
      'Control the descent',
      'Avoid swinging'
    ],
    formTips: [
      'Tilt pelvis up at top',
      'Control the swing',
      'Exhale as you raise legs'
    ],
    commonMistakes: [
      'Swinging momentum',
      'Not tilting pelvis',
      'Bending knees when doing straight leg version'
    ],
  },
  {
    id: 'ex-031',
    name: 'Mountain Climbers',
    description: 'Dynamic core and cardio exercise',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['shoulders', 'cardiovascular'],
    equipment: ['none'],
    difficulty: 'intermediate',
    instructions: [
      'Start in push-up position',
      'Bring one knee toward chest',
      'Quickly switch legs',
      'Continue alternating at a brisk pace',
      'Keep hips level'
    ],
    formTips: [
      'Keep core tight',
      'Don\'t let hips rise',
      'Breathe rhythmically'
    ],
    commonMistakes: [
      'Hiking hips up',
      'Not bringing knee far enough forward',
      'Going too slow'
    ],
  },

  // ===== CARDIO EXERCISES =====
  {
    id: 'ex-032',
    name: 'Running',
    description: 'Classic cardiovascular endurance exercise',
    category: 'cardio',
    primaryMuscles: ['cardiovascular'],
    secondaryMuscles: ['quadriceps', 'hamstrings', 'calves'],
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Start with warm-up walk or light jog',
      'Maintain steady, sustainable pace',
      'Land on midfoot, not heel',
      'Keep posture upright',
      'Control breathing with rhythm'
    ],
    formTips: [
      'Land softly',
      'Keep cadence around 170-180 steps/min',
      'Swing arms naturally'
    ],
    commonMistakes: [
      'Overstriding',
      'Heel striking too hard',
      'Starting too fast'
    ],
  },
  {
    id: 'ex-033',
    name: 'Cycling',
    description: 'Low-impact cardio exercise',
    category: 'cardio',
    primaryMuscles: ['cardiovascular'],
    secondaryMuscles: ['quadriceps', 'hamstrings', 'calves'],
    equipment: ['stationary-bike'],
    difficulty: 'beginner',
    instructions: [
      'Adjust seat height properly',
      'Start with warm-up at easy pace',
      'Maintain steady cadence (80-100 RPM)',
      'Adjust resistance as needed',
      'Cool down at easy pace'
    ],
    formTips: [
      'Proper seat height: slight knee bend at bottom',
      'Keep core engaged',
      'Smooth pedal strokes'
    ],
    commonMistakes: [
      'Seat too high or low',
      'Gripping handlebars too tight',
      'Inconsistent cadence'
    ],
  },
  {
    id: 'ex-034',
    name: 'Rowing Machine',
    description: 'Full-body cardio exercise',
    category: 'cardio',
    primaryMuscles: ['cardiovascular', 'back'],
    secondaryMuscles: ['quadriceps', 'hamstrings', 'biceps'],
    equipment: ['rowing-machine'],
    difficulty: 'intermediate',
    instructions: [
      'Secure feet in straps',
      'Start with legs compressed, arms extended',
      'Push with legs first',
      'Then lean back and pull handle to chest',
      'Reverse order to return'
    ],
    formTips: [
      'Legs-body-arms on drive, reverse on recovery',
      'Keep back straight',
      'Pull handle to lower ribs'
    ],
    commonMistakes: [
      'Pulling with arms first',
      'Rounding back',
      'Rushing the recovery'
    ],
  },
  {
    id: 'ex-035',
    name: 'Jump Rope',
    description: 'High-intensity cardio and coordination exercise',
    category: 'cardio',
    primaryMuscles: ['cardiovascular'],
    secondaryMuscles: ['calves', 'shoulders'],
    equipment: ['jump-rope'],
    difficulty: 'intermediate',
    instructions: [
      'Hold rope handles at hip level',
      'Swing rope overhead and jump as it passes under',
      'Land on balls of feet',
      'Keep jumps small and quick',
      'Maintain rhythm'
    ],
    formTips: [
      'Jump only high enough to clear rope',
      'Keep elbows close to body',
      'Rotate from wrists, not arms'
    ],
    commonMistakes: [
      'Jumping too high',
      'Using arms instead of wrists',
      'Looking down'
    ],
  },
  {
    id: 'ex-036',
    name: 'Burpees',
    description: 'Full-body high-intensity exercise',
    category: 'hiit',
    primaryMuscles: ['cardiovascular', 'full-body'],
    secondaryMuscles: ['chest', 'abs', 'quadriceps'],
    equipment: ['none'],
    difficulty: 'intermediate',
    instructions: [
      'Start standing',
      'Drop into squat, hands on ground',
      'Kick feet back into plank',
      'Do push-up (optional)',
      'Jump feet back to squat and jump up'
    ],
    formTips: [
      'Land softly',
      'Keep core tight in plank',
      'Can modify by stepping instead of jumping'
    ],
    commonMistakes: [
      'Sagging hips in plank',
      'Not fully extending on jump',
      'Going too fast with poor form'
    ],
  },

  // ===== FLEXIBILITY & STRETCHING =====
  {
    id: 'ex-037',
    name: 'Downward Dog',
    description: 'Yoga pose for hamstring and shoulder flexibility',
    category: 'flexibility',
    primaryMuscles: ['hamstrings', 'calves'],
    secondaryMuscles: ['shoulders', 'back'],
    equipment: ['yoga-mat'],
    difficulty: 'beginner',
    instructions: [
      'Start on hands and knees',
      'Lift hips up and back, forming inverted V',
      'Press heels toward ground',
      'Push chest toward thighs',
      'Hold and breathe deeply'
    ],
    formTips: [
      'Keep hands shoulder-width apart',
      'Bend knees if hamstrings are tight',
      'Relax neck'
    ],
    commonMistakes: [
      'Rounding back',
      'Shoulders too far forward',
      'Holding breath'
    ],
  },
  {
    id: 'ex-038',
    name: 'Child\'s Pose',
    description: 'Resting yoga pose for back and hips',
    category: 'flexibility',
    primaryMuscles: ['back'],
    secondaryMuscles: ['shoulders'],
    equipment: ['yoga-mat'],
    difficulty: 'beginner',
    instructions: [
      'Start on hands and knees',
      'Sit back on heels',
      'Extend arms forward',
      'Rest forehead on ground',
      'Breathe deeply and relax'
    ],
    formTips: [
      'Can widen knees for deeper stretch',
      'Focus on breathing',
      'Allow body to sink'
    ],
    commonMistakes: [
      'Not sitting back enough',
      'Tension in shoulders',
      'Holding breath'
    ],
  },
  {
    id: 'ex-039',
    name: 'Pigeon Pose',
    description: 'Deep hip flexor and glute stretch',
    category: 'flexibility',
    primaryMuscles: ['glutes', 'hip-flexors'],
    secondaryMuscles: [],
    equipment: ['yoga-mat'],
    difficulty: 'intermediate',
    instructions: [
      'From plank, bring one knee forward',
      'Extend other leg straight back',
      'Square hips forward',
      'Lower down as far as comfortable',
      'Hold and breathe, then switch sides'
    ],
    formTips: [
      'Use props under hip if needed',
      'Keep hips square',
      'Don\'t force the stretch'
    ],
    commonMistakes: [
      'Hips not square',
      'Forcing knee angle',
      'Holding breath'
    ],
  },
  {
    id: 'ex-040',
    name: 'Cat-Cow Stretch',
    description: 'Spinal mobility exercise',
    category: 'flexibility',
    primaryMuscles: ['back', 'abs'],
    secondaryMuscles: [],
    equipment: ['yoga-mat'],
    difficulty: 'beginner',
    instructions: [
      'Start on hands and knees',
      'Arch back and look up (cow)',
      'Round back and tuck chin (cat)',
      'Flow between positions with breath',
      'Repeat for several cycles'
    ],
    formTips: [
      'Move with breath',
      'Full spinal articulation',
      'Smooth, controlled movements'
    ],
    commonMistakes: [
      'Moving too fast',
      'Not using full range',
      'Breath not synchronized'
    ],
  },

  // ===== ADDITIONAL EXERCISES =====
  {
    id: 'ex-041',
    name: 'Farmer\'s Walk',
    description: 'Loaded carry for grip strength and stability',
    category: 'strength',
    primaryMuscles: ['forearms'],
    secondaryMuscles: ['shoulders', 'abs', 'back'],
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    instructions: [
      'Hold heavy dumbbells or kettlebells at sides',
      'Stand tall with shoulders back',
      'Walk forward with controlled steps',
      'Maintain upright posture',
      'Walk for distance or time'
    ],
    formTips: [
      'Keep core braced',
      'Don\'t lean to either side',
      'Take natural steps'
    ],
    commonMistakes: [
      'Leaning forward or to sides',
      'Shrugging shoulders',
      'Using too much weight and compromising form'
    ],
  },
  {
    id: 'ex-042',
    name: 'Box Jumps',
    description: 'Plyometric exercise for explosive power',
    category: 'hiit',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['calves', 'hamstrings'],
    equipment: ['none'],
    difficulty: 'advanced',
    instructions: [
      'Stand facing sturdy box or platform',
      'Swing arms and jump onto box',
      'Land softly with feet flat',
      'Stand up fully on box',
      'Step down carefully'
    ],
    formTips: [
      'Start with lower height',
      'Land softly',
      'Full hip extension at top'
    ],
    commonMistakes: [
      'Jumping down (hard on joints)',
      'Not fully extending on box',
      'Using box too high and dangerous landing'
    ],
  },
  {
    id: 'ex-043',
    name: 'Turkish Get-Up',
    description: 'Complex full-body movement for strength and mobility',
    category: 'strength',
    primaryMuscles: ['full-body'],
    secondaryMuscles: ['shoulders', 'abs', 'glutes'],
    equipment: ['kettlebell'],
    difficulty: 'advanced',
    instructions: [
      'Lie on back holding weight overhead',
      'Roll to elbow, then to hand',
      'Bridge hips up',
      'Sweep leg back to lunge position',
      'Stand up, then reverse the movement'
    ],
    formTips: [
      'Keep eyes on weight throughout',
      'Learn movement without weight first',
      'Move deliberately'
    ],
    commonMistakes: [
      'Moving too fast',
      'Not keeping arm vertical',
      'Skipping steps'
    ],
  },
  {
    id: 'ex-044',
    name: 'Kettlebell Swing',
    description: 'Hip hinge power movement',
    category: 'strength',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['back', 'shoulders', 'abs'],
    equipment: ['kettlebell'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with kettlebell between feet',
      'Hinge at hips and swing kettlebell back',
      'Drive hips forward explosively',
      'Swing kettlebell to shoulder height',
      'Let it swing back and repeat'
    ],
    formTips: [
      'Power comes from hips, not arms',
      'Keep back flat',
      'Squeeze glutes at top'
    ],
    commonMistakes: [
      'Squatting instead of hinging',
      'Using arms to lift',
      'Leaning back at top'
    ],
  },
  {
    id: 'ex-045',
    name: 'Battle Ropes',
    description: 'High-intensity upper body and cardio exercise',
    category: 'hiit',
    primaryMuscles: ['shoulders', 'cardiovascular'],
    secondaryMuscles: ['abs', 'back'],
    equipment: ['none'],
    difficulty: 'intermediate',
    instructions: [
      'Hold one end of rope in each hand',
      'Stand with feet shoulder-width apart',
      'Create waves by moving arms up and down',
      'Maintain consistent rhythm',
      'Continue for time or rounds'
    ],
    formTips: [
      'Slight knee bend',
      'Keep core engaged',
      'Breathe consistently'
    ],
    commonMistakes: [
      'Standing too upright',
      'Slowing down too much',
      'Holding breath'
    ],
  },
  {
    id: 'ex-046',
    name: 'Wall Sit',
    description: 'Isometric quad exercise',
    category: 'strength',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Lean back against wall',
      'Slide down until knees at 90 degrees',
      'Keep back flat against wall',
      'Hold position for time',
      'Breathe normally'
    ],
    formTips: [
      'Knees directly over ankles',
      'Full 90-degree angle',
      'Press back into wall'
    ],
    commonMistakes: [
      'Knees too far forward',
      'Not sitting deep enough',
      'Holding breath'
    ],
  },
  {
    id: 'ex-047',
    name: 'Superman Hold',
    description: 'Lower back strengthening exercise',
    category: 'strength',
    primaryMuscles: ['lower-back'],
    secondaryMuscles: ['glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Lie face down with arms extended overhead',
      'Simultaneously lift arms, chest, and legs off ground',
      'Hold position, squeezing lower back and glutes',
      'Keep neck neutral',
      'Lower and repeat'
    ],
    formTips: [
      'Don\'t overextend',
      'Focus on quality over height',
      'Breathe steadily'
    ],
    commonMistakes: [
      'Cranking neck back',
      'Holding breath',
      'Overextending spine'
    ],
  },
  {
    id: 'ex-048',
    name: 'Glute Bridge',
    description: 'Glute activation and strengthening',
    category: 'strength',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'abs'],
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Lie on back with knees bent, feet flat',
      'Press through heels to lift hips',
      'Squeeze glutes at top',
      'Form straight line from knees to shoulders',
      'Lower and repeat'
    ],
    formTips: [
      'Drive through heels',
      'Squeeze glutes hard at top',
      'Don\'t overarch lower back'
    ],
    commonMistakes: [
      'Pushing through toes instead of heels',
      'Not fully extending hips',
      'Arching back too much'
    ],
  },
  {
    id: 'ex-049',
    name: 'Medicine Ball Slam',
    description: 'Explosive full-body power exercise',
    category: 'hiit',
    primaryMuscles: ['full-body'],
    secondaryMuscles: ['abs', 'shoulders', 'back'],
    equipment: ['medicine-ball'],
    difficulty: 'intermediate',
    instructions: [
      'Hold medicine ball overhead',
      'Rise up on toes',
      'Slam ball down forcefully',
      'Catch ball on bounce',
      'Repeat in continuous motion'
    ],
    formTips: [
      'Full body extension',
      'Engage core on slam',
      'Use hips to generate power'
    ],
    commonMistakes: [
      'Using only arms',
      'Ball not bouncing (too soft)',
      'Poor catching position'
    ],
  },
  {
    id: 'ex-050',
    name: 'Foam Rolling',
    description: 'Self-myofascial release for recovery',
    category: 'flexibility',
    primaryMuscles: ['full-body'],
    secondaryMuscles: [],
    equipment: ['foam-roller'],
    difficulty: 'beginner',
    instructions: [
      'Position foam roller under target muscle',
      'Use body weight to apply pressure',
      'Roll slowly over muscle',
      'Pause on tender spots',
      'Breathe and relax into pressure'
    ],
    formTips: [
      'Move slowly',
      'Don\'t roll directly on joints',
      'Breathe through discomfort'
    ],
    commonMistakes: [
      'Rolling too fast',
      'Rolling on joints',
      'Too much pressure too quickly'
    ],
  },
];

// ==================== Workout Templates ====================

export const seedWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: 'template-001',
    name: 'Full Body Strength',
    description: 'Comprehensive full-body workout targeting all major muscle groups',
    type: 'full-body',
    difficulty: 'intermediate',
    estimatedDuration: 60,
    targetMuscles: ['chest', 'back', 'quadriceps', 'shoulders'],
    exercises: [
      { exerciseId: 'ex-011', order: 1, sets: 4, targetReps: '8-10', restTime: 120, notes: 'Focus on depth' },
      { exerciseId: 'ex-001', order: 2, sets: 4, targetReps: '8-10', restTime: 90 },
      { exerciseId: 'ex-008', order: 3, sets: 4, targetReps: '10-12', restTime: 90 },
      { exerciseId: 'ex-017', order: 4, sets: 3, targetReps: '8-10', restTime: 90 },
      { exerciseId: 'ex-012', order: 5, sets: 3, targetReps: '10-12', restTime: 60 },
      { exerciseId: 'ex-027', order: 6, sets: 3, targetDuration: 60, restTime: 45 },
    ],
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-002',
    name: 'Upper Body Push',
    description: 'Focused chest, shoulder, and tricep workout',
    type: 'push',
    difficulty: 'intermediate',
    estimatedDuration: 45,
    targetMuscles: ['chest', 'shoulders', 'triceps'],
    exercises: [
      { exerciseId: 'ex-001', order: 1, sets: 4, targetReps: '8-10', restTime: 90 },
      { exerciseId: 'ex-003', order: 2, sets: 4, targetReps: '8-10', restTime: 90 },
      { exerciseId: 'ex-017', order: 3, sets: 3, targetReps: '8-10', restTime: 90 },
      { exerciseId: 'ex-018', order: 4, sets: 3, targetReps: '12-15', restTime: 60 },
      { exerciseId: 'ex-024', order: 5, sets: 3, targetReps: '10-12', restTime: 60 },
      { exerciseId: 'ex-026', order: 6, sets: 3, targetReps: '12-15', restTime: 45 },
    ],
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-003',
    name: 'Lower Body Power',
    description: 'Intense leg workout for strength and size',
    type: 'legs',
    difficulty: 'advanced',
    estimatedDuration: 60,
    targetMuscles: ['quadriceps', 'glutes', 'hamstrings', 'calves'],
    exercises: [
      { exerciseId: 'ex-011', order: 1, sets: 5, targetReps: '5-8', restTime: 180 },
      { exerciseId: 'ex-012', order: 2, sets: 4, targetReps: '8-10', restTime: 120 },
      { exerciseId: 'ex-013', order: 3, sets: 4, targetReps: '10-12', restTime: 90 },
      { exerciseId: 'ex-014', order: 4, sets: 3, targetReps: '10 each leg', restTime: 60 },
      { exerciseId: 'ex-015', order: 5, sets: 3, targetReps: '12-15', restTime: 60 },
      { exerciseId: 'ex-016', order: 6, sets: 4, targetReps: '15-20', restTime: 45 },
    ],
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-004',
    name: 'Upper Body Pull',
    description: 'Back and bicep focused workout',
    type: 'pull',
    difficulty: 'intermediate',
    estimatedDuration: 45,
    targetMuscles: ['back', 'biceps'],
    exercises: [
      { exerciseId: 'ex-006', order: 1, sets: 4, targetReps: '5-8', restTime: 120 },
      { exerciseId: 'ex-007', order: 2, sets: 4, targetReps: '8-12', restTime: 90 },
      { exerciseId: 'ex-008', order: 3, sets: 4, targetReps: '10-12', restTime: 90 },
      { exerciseId: 'ex-020', order: 4, sets: 3, targetReps: '12-15', restTime: 60 },
      { exerciseId: 'ex-021', order: 5, sets: 3, targetReps: '10-12', restTime: 60 },
      { exerciseId: 'ex-023', order: 6, sets: 3, targetReps: '10-12', restTime: 45 },
    ],
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-005',
    name: 'HIIT Cardio Blast',
    description: '30-minute high-intensity interval training',
    type: 'hiit',
    difficulty: 'advanced',
    estimatedDuration: 30,
    targetMuscles: ['cardiovascular', 'full-body'],
    exercises: [
      { exerciseId: 'ex-036', order: 1, sets: 4, targetReps: '15', restTime: 30 },
      { exerciseId: 'ex-031', order: 2, sets: 4, targetDuration: 30, restTime: 30 },
      { exerciseId: 'ex-042', order: 3, sets: 4, targetReps: '10', restTime: 30 },
      { exerciseId: 'ex-035', order: 4, sets: 4, targetDuration: 60, restTime: 30 },
      { exerciseId: 'ex-045', order: 5, sets: 3, targetDuration: 30, restTime: 45 },
    ],
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-006',
    name: 'Core & Abs Crusher',
    description: 'Dedicated core strengthening workout',
    type: 'core',
    difficulty: 'intermediate',
    estimatedDuration: 30,
    targetMuscles: ['abs', 'obliques'],
    exercises: [
      { exerciseId: 'ex-027', order: 1, sets: 3, targetDuration: 60, restTime: 45 },
      { exerciseId: 'ex-028', order: 2, sets: 3, targetReps: '20', restTime: 30 },
      { exerciseId: 'ex-029', order: 3, sets: 3, targetReps: '20 each side', restTime: 30 },
      { exerciseId: 'ex-030', order: 4, sets: 3, targetReps: '12-15', restTime: 60 },
      { exerciseId: 'ex-031', order: 5, sets: 3, targetDuration: 30, restTime: 30 },
    ],
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-007',
    name: 'Beginner Full Body',
    description: 'Perfect introduction to resistance training',
    type: 'full-body',
    difficulty: 'beginner',
    estimatedDuration: 40,
    targetMuscles: ['chest', 'back', 'quadriceps', 'shoulders'],
    exercises: [
      { exerciseId: 'ex-004', order: 1, sets: 3, targetReps: '10-15', restTime: 60 },
      { exerciseId: 'ex-048', order: 2, sets: 3, targetReps: '15', restTime: 45 },
      { exerciseId: 'ex-009', order: 3, sets: 3, targetReps: '12', restTime: 60 },
      { exerciseId: 'ex-018', order: 4, sets: 3, targetReps: '12', restTime: 45 },
      { exerciseId: 'ex-027', order: 5, sets: 3, targetDuration: 30, restTime: 45 },
    ],
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-008',
    name: 'Flexibility & Mobility',
    description: 'Recovery and flexibility focused session',
    type: 'flexibility',
    difficulty: 'beginner',
    estimatedDuration: 30,
    targetMuscles: ['full-body'],
    exercises: [
      { exerciseId: 'ex-037', order: 1, sets: 1, targetDuration: 60, restTime: 15 },
      { exerciseId: 'ex-038', order: 2, sets: 1, targetDuration: 60, restTime: 15 },
      { exerciseId: 'ex-039', order: 3, sets: 2, targetDuration: 60, restTime: 15, notes: 'Each side' },
      { exerciseId: 'ex-040', order: 4, sets: 1, targetReps: '10', restTime: 15 },
      { exerciseId: 'ex-050', order: 5, sets: 1, targetDuration: 300, restTime: 0, notes: 'Full body rolling' },
    ],
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initialize seed data in localStorage
export function initializeSeedData() {
  const exercises = localStorage.getItem('checkpoint_exercises');
  const templates = localStorage.getItem('checkpoint_workout_templates');

  if (!exercises || JSON.parse(exercises).length === 0) {
    localStorage.setItem('checkpoint_exercises', JSON.stringify(seedExercises));
  }

  if (!templates || JSON.parse(templates).length === 0) {
    localStorage.setItem('checkpoint_workout_templates', JSON.stringify(seedWorkoutTemplates));
  }
}
