export const TASK_STATUES = [
    {
        name: '🟢 Completed',
        value: 'complete',
        order: 0
    },
    {
        name: '🟡 In progress',
        value: 'in-progress',
        order: 1
    },
    {
        name: '🔴 Failed',
        value: 'failed',
        order: 2
    },
]

export const MESSAGES = [
    'What projects did you work on yesterday?',
    'What projects are you working on today?'
]

export const OUTPUT_MESSAGES = {
    [MESSAGES[0]]: ':white_check_mark: What you worked on yesterday?',
    [MESSAGES[1]]: ':dart: What are you working on today?'
}

