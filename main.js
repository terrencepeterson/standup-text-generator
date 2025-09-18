import { checkbox } from '@inquirer/prompts'
import { confirm } from '@inquirer/prompts'
import { input } from '@inquirer/prompts'
import { select } from '@inquirer/prompts'

const PROJECT_CHOICES = [
    { name: 'Police Supplies', value: 'police-supplies' },
    { name: 'Killer Ink', value: 'killer-ink' },
    { name: 'Utility Design', value: 'utility-design' }
]

const TASK_STATUES = [
    {
        name: '🟢 Completed',
        value: 'complete',
    },
    {
        name: '🟡 In progress',
        value: 'in-progress',
    },
    {
        name: '🔴 Failed',
        value: 'failed',
    },
]

const TODAY_KEY = 'today'
const YESTERDAY_KEY = 'yesterday'
const MESSAGES = {
    [YESTERDAY_KEY]: 'What projects you work on yesterday?',
    [TODAY_KEY]: 'What project are you working on today?'
}

const getNameFromValue = (choices, value) => choices.find(p => p.value === value).name

async function getTask(projectName, blockers) {
    const taskDescription = await input({ required: true, message: `Please describe the task (${projectName})` })
    const taskUrl = await input({ message: `Please provide the MiesterTask url (not required)` })
    const taskStatus = await select({
        message: 'What is the status of the task',
        choices: TASK_STATUES,
    })
    const task = { taskDescription, taskUrl, taskStatus }

    if (taskStatus === 'in-progress' || taskStatus === 'failed') {
        const isBlocked = await confirm({ message: 'Is this task blocked (y/N)' });
        if (isBlocked) {
            const blocked = await input({ message: 'Why is it blocked?' })
            blockers.push({ ...task, blocked })
        }
    }

    const shouldContinue = await confirm({ message: `Are there other tasks for ${projectName}?` });
    if (shouldContinue) {
        const tasks = await getTask(projectName, blockers)
        tasks.unshift(task)
        return tasks
    } else {
        return [task]
    }
}

async function getDay(dayType) {
    const message = MESSAGES[dayType]
    const config = { dayType }
    const blockers = []
    const projects = await checkbox({
        message,
        required: true,
        choices: PROJECT_CHOICES
    })

    for (const projectValue of projects) {
        config[projectValue] = await getTask(getNameFromValue(PROJECT_CHOICES, projectValue), blockers)
    }

    return config
}

console.log(await getDay(YESTERDAY_KEY))

