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
        name: '🟢 Complete',
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
const getProjectNameFromValue = value => PROJECT_CHOICES.find(p => p.value === value).name

async function getTask(projectName, blockers) {
    const taskDescription = await input({ required: true, message: `Please describe the task that you worked on (${projectName})` })
    const taskUrl = await input({ message: `Please provide the MiesterTask url (not required)` })
    const taskStatus = await select({
        message: 'What is the status of the task',
        choices: TASK_STATUES,
    })

    if (taskStatus === 'in-progress' || taskStatus === 'failed') {
        const isBlocked = await confirm({ message: 'Is this task blocked (y/N)'});
        if (isBlocked) {
            const blocker = await input({ message: 'Why is it blocked?'})
            blockers.push(blocker)
        }
    }

    const shouldContinue = await confirm({ message: `Did you work on another task for ${projectName}?` });
    if (shouldContinue) {
        const tasks = await getTask(projectName, blockers)
        tasks.unshift({taskDescription, taskUrl, taskStatus})
        return tasks
    } else {
        return [{taskDescription, taskUrl, taskStatus}]
    }
}

const projects = await checkbox({
    message: 'What projects have you worked on today?',
    required: true,
    choices: PROJECT_CHOICES
})

const config = {}
const blockers = []
for (const projectValue of projects) {
    config[projectValue] = await getTask(getProjectNameFromValue(projectValue), blockers)
}

