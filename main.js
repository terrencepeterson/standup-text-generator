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

const MESSAGES = [
    'What projects did you work on yesterday?',
    'What projects are you working on today?'
]

const getNameFromValue = (choices, value) => choices.find(p => p.value === value).name
const getBoldText = text => `*${text}*`
const getTaskLink = url => `([Task](${url}))`

async function getTaskConfig(projectName, blockers, shouldGetStatus) {
    const task = {}
    task.taskDescription = await input({ required: true, message: `Please describe the task (${projectName})` })
    task.taskUrl = await input({ message: `Please provide the MiesterTask url (not required)` })
    if (shouldGetStatus) {
        task.taskStatus = await select({
            message: 'What is the status of the task',
            choices: TASK_STATUES,
        })
    }

    if (Object.hasOwn(task, 'taskStatus') && task.taskStatus === TASK_STATUES[1].value || task.taskStatus === TASK_STATUES[2].value) {
        const isBlocked = await confirm({ message: 'Is this task blocked (y/N)' });
        if (isBlocked) {
            const blocked = await input({ message: 'Why is it blocked?' })
            blockers.push({ ...task, blocked })
        }
    }

    const shouldContinue = await confirm({ message: `Are there other tasks for ${projectName}?` });
    if (shouldContinue) {
        const tasks = await getTaskConfig(projectName, blockers, shouldGetStatus)
        tasks.unshift(task)
        return tasks
    } else {
        return [task]
    }
}

async function getDayConfig(message, shouldGetStatus, blockers) {
    const config = { message, projects: {} }
    const projects = await checkbox({
        message,
        required: true,
        choices: PROJECT_CHOICES
    })

    for (const projectValue of projects) {
        config.projects[projectValue] = await getTaskConfig(getNameFromValue(PROJECT_CHOICES, projectValue), blockers, shouldGetStatus)
    }

    return config
}

function getProjectOutput(projectValue, tasks) {
    let projectOutput = getBoldText(getNameFromValue(PROJECT_CHOICES, projectValue))
    const hasStatus = tasks.some(t => Object.hasOwn(t, 'taskStatus'))
    const getTasksText = (taskOutput, tasks, isTabbed) =>
        tasks.reduce((acum, task) =>
            acum += `\n${isTabbed ? '\t' : ''} - ${task.taskDescription} ${task.taskUrl ? getTaskLink(task.taskUrl) : ''}`
        , taskOutput)

    if (!hasStatus) {
        return getTasksText(projectOutput, tasks) += '\n'
    }

    const statusSortedTasks = {}
    for (const task of tasks) {
        if (Object.hasOwn(statusSortedTasks, task.taskStatus)) {
            statusSortedTasks[task.taskStatus].push(task)
        } else {
            statusSortedTasks[task.taskStatus] = [task]
        }
    }

    for (const [taskStatusValue, tasks] of Object.entries(statusSortedTasks)) {
        projectOutput += `\n${getNameFromValue(TASK_STATUES, taskStatusValue)}`
        projectOutput = getTasksText(projectOutput, tasks, true)
    }

    return projectOutput += '\n'
}

function getDayOutput(config) {
    let output = config.message + '\n'

    for (const [projectValue, tasks] of Object.entries(config.projects)) {
        output += getProjectOutput(projectValue, tasks)
    }

    return output += '\n\n'
}

async function getStandupText(days) {
    let output = ''
    const blockers = []
    for (const [i, day] of days.entries()) {
        const config = await getDayConfig(day, i === 0, blockers) // only ask for the status on the first one
        output += getDayOutput(config)
    }
}

getStandupText(MESSAGES)

