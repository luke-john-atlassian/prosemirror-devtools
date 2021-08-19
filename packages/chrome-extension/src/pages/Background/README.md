# Background

## Frontend <-> Background

The Background receives connections from frontends (via content scripts).

Connections from frontends pipe events to background per document with devtools plugin;

- document init:
  the initial document
  the view container
  creation date
  tab id
- transactions:
  - timestamp
  - transaction
  - new document
- document close:

These are serialized, and stored in local storage.

On tab close, any documents being tracked are cleared from local storage.

## Devtools <-> Background

The Background receives connections from the devtools panel.

The Devtools panel makes queries to the Background with the active tab id;

- list documents
  - the view container
  - creation date

The Devtools registers subscriptions in the Background to a documents events,

On subscription, the Background responds with the latest details of that document.

- document
- transactions
  - timestamp
  - transaction
  - document
