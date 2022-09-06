# Agent Queue Stats Example Flex Plugin

In Flex, workers with only the agent role cannot access the Queue Stats view. Hacking the Queue Stats view in results in failed API calls and an error page, so an alternative approach is needed. This plugin adds a new view to the side nav for workers with the agent role, "Agent Queue Stats."

![Agent teams complex view demo](resources/stats.gif)

While this example is displaying only a few statistics in the data table, additional data is being stored into Redux for you to use, including half-hour stats and worker activity breakdown by queue. See the data model section below for a full listing of available data.

## How it works

Twilio Flex maintains several Twilio Sync maps that contain queue stats data. This plugin uses a live query on the `tr-queue` index to maintain a listing of all known queues, then subscribes to the corresponding `realtime_statistics.v1` map for each queue. This data is then maintained and updated in real-time within the `agentQueueStats` Redux namespace.

## Pre-requisites

This plugin is designed for usage with Flex UI 1.x only.

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Next, please install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart). If you are using Homebrew on macOS, you can do so by running:

```bash
brew tap twilio/brew && brew install twilio
```

Finally, install the [Flex Plugin extension](https://www.twilio.com/docs/flex/developer/plugins/cli/install) for the Twilio CLI:

```bash
twilio plugins:install @twilio-labs/plugin-flex
```

## Installation

First, clone the repository and change to its directory:

```bash
git clone https://github.com/dremin/plugin-agent-queue-stats.git

cd plugin-agent-queue-stats
```

Copy `public/appConfig.example.js` to `public/appConfig.js`:

```bash
cp public/appConfig.example.js public/appConfig.js
```

Install the dependencies:

```bash
npm install
```

Run the plugin locally:

```bash
twilio flex:plugins:start
```

## Data model

Queue stats data is populated in the `agentQueueStats` Redux namespace. Here is that namespace's data model:

```
{
  stats: [
    {
      queue: {
        queue_name: string
        date_updated: string
        workspace_sid: string
        queue_sid: string
      }
      tasks_now: {
        pending_tasks: number
        reserved_tasks: number
        assigned_tasks: number
        wrapping_tasks: number
        waiting_tasks: number
        active_tasks: number
        total_tasks: number
        longest_task_waiting_sid: string
        longest_task_waiting_from: string
        timestamp_updated: number
      }
      tasks_thirty_minutes: {
        total_tasks_count: number
        handled_tasks_count: number
        handled_tasks_within_sl_threshold_count: number
        handled_tasks_within_sl_threshold_percentage: number
        abandoned_tasks_count: number
        abandoned_tasks_percentage: number
        short_abandoned_tasks_count: number
        short_abandoned_tasks_percentage: number
        flow_out_tasks_count: number
        flow_out_tasks_percentage: number
        sla_percentage: number
        timestamp_updated: number
      }
      tasks_today: {
        total_tasks_count: number
        handled_tasks_count: number
        handled_tasks_within_sl_threshold_count: number
        handled_tasks_within_sl_threshold_percentage: number
        abandoned_tasks_count: number
        abandoned_tasks_percentage: number
        short_abandoned_tasks_count: number
        short_abandoned_tasks_percentage: number
        flow_out_tasks_count: number
        flow_out_tasks_percentage: number
        sla_percentage: number
        timestamp_updated: number
      }
      workers: {
        activity_statistics: [
          sid: string
          workers: number
          friendly_name: string
        ]
        timestamp_updated: number
        total_available_workers: number
        total_eligible_workers: number
      }
    }
  ]
}
```

## Deployment

Once you are happy with your plugin, you have to deploy then release the plugin for it to take affect on Twilio hosted Flex.

Run the following command to start the deployment:

```bash
twilio flex:plugins:deploy --major --changelog "Notes for this version" --description "Functionality of the plugin"
```

After your deployment runs you will receive instructions for releasing your plugin from the bash prompt. You can use this or skip this step and release your plugin from the Flex plugin dashboard here https://flex.twilio.com/admin/plugins

For more details on deploying your plugin, refer to the [deploying your plugin guide](https://www.twilio.com/docs/flex/plugins#deploying-your-plugin).

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.

## Disclaimer

**This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.**
