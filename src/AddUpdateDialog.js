import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export default function AddUpdateDialog(props) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [deadline, setDeadline] = React.useState('');
  const [priority, setPriority] = React.useState('');
  const [titleError, setTitleError] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState(false);
  const [deadlineError, setDeadlineError] = React.useState(false);
  const [noPriority, setNoPriority] = React.useState(false);
  const [isTitleUnique, setIsTitleUnique] = React.useState(true);

  const handleClose = () => {
    props.onClose({
      title: title,
      description: description,
      deadline: deadline,
      priority: priority,
      isComplete: false,
    });
    // Clear the input fields
    setTitle('');
    setDescription('');
    setDeadline('');
    setPriority('');
    // Clear the error fields
    setTitleError(false);
    setDescriptionError(false);
    setDeadlineError(false);
    setNoPriority(false);
    setIsTitleUnique(true);
    // Call showToast() from the parent
    props.showToast(
      props.dialogType === 'add'
        ? 'Task added successfully'
        : 'Task updated successfully'
    );
  };
  const handleCloseNoInput = () => {
    props.onClose();
    // Clear the input fields if this is an add dialog
    if (props.dialogType === 'add') {
      setTitle('');
      setDescription('');
      setDeadline('');
      setPriority('');
    }
    // Clear the error fields
    setTitleError(false);
    setDescriptionError(false);
    setDeadlineError(false);
    setNoPriority(false);
  };
  const validateInput = (target, field) => {
    // Make sure the user entered a title, description, and deadline
    if (target.value !== '') {
      if ((props.dialogType === 'add') & (field === 'title')) {
        if (
          props.tasks.findIndex((task) => task.title === target.value) !== -1
        ) {
          setTitleError(true);

          setIsTitleUnique(false);
          return;
        } else {
          setTitleError(false);
          setTitle(target.value);
          setIsTitleUnique(true);
        }
      }
      if (field === 'description') {
        setDescriptionError(false);
        setDescription(target.value);
      }
      if (field === 'deadline') {
        setDeadlineError(false);
        setDeadline(target.value);
      }
    }
    // Otherwise set the 'error' attribute to the target
    else {
      if ((props.dialogType === 'add') & (field === 'title')) {
        setTitleError(true);
        setTitle('');
      }
      if (field === 'description') {
        setDescriptionError(true);
        setDescription('');
      }
      if (field === 'deadline') {
        setDeadlineError(true);
        setDeadline('');
      }
    }
  };
  const checkBeforeAdd = () => {
    // Make sure the user entered a title, description, and deadline
    if (props.dialogType === 'add') {
      if (
        title !== '' &&
        isTitleUnique === true &&
        description !== '' &&
        deadline !== '' &&
        priority !== ''
      ) {
        handleClose();
        return;
      }
    } else if (props.dialogType === 'update') {
      if (description !== '' && deadline !== '' && priority !== '') {
        handleClose();
        return;
      }
    }

    // Otherwise touch all the fields to show the error messages, if any
    if (props.dialogType === 'add')
      validateInput(document.getElementById('title'), 'title');
    validateInput(document.getElementById('description'), 'description');
    validateInput(document.getElementById('deadline'), 'deadline');
    if (priority === '') {
      setNoPriority(true);
    }
  };
  return (
    <div>
      <Dialog open={props.open} onClose={handleCloseNoInput}>
        <DialogTitle style={{ backgroundColor: '#1874E5', color: 'white' }}>
          {props.dialogType === 'add' ? (
            <FontAwesomeIcon icon={faPlusCircle} />
          ) : (
            <FontAwesomeIcon icon={faEdit} />
          )}
          &nbsp;{props.dialogType === 'add' ? 'Add' : 'Update'} Task
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          {props.dialogType === 'add' ? (
            <TextField
              required
              autoFocus
              error={titleError}
              helperText={
                titleError
                  ? 'Please enter a ' +
                    (!isTitleUnique ? 'unique' : '') +
                    ' title.'
                  : ''
              }
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => validateInput(e.target, 'title')}
              onBlur={(e) => validateInput(e.target, 'title')}
            />
          ) : null}
          <TextField
            required
            margin="dense"
            id="description"
            error={descriptionError}
            helperText={descriptionError ? 'Please enter a description' : ''}
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={
              props.dialogType === 'update' ? props.value.description : ''
            }
            onChange={(e) => validateInput(e.target, 'description')}
            onBlur={(e) => validateInput(e.target, 'description')}
          />
          <TextField
            required
            error={deadlineError}
            helperText={deadlineError ? 'Please enter a deadline' : ''}
            margin="dense"
            id="deadline"
            label=""
            type="date"
            fullWidth
            variant="standard"
            defaultValue={
              props.dialogType === 'update' ? props.value.deadline : ''
            }
            onChange={(e) => validateInput(e.target, 'deadline')}
            onBlur={(e) => validateInput(e.target, 'deadline')}
          />
          <DialogContentText>Priority</DialogContentText>
          {noPriority ? (
            <DialogContentText style={{ color: 'red' }}>
              Please select a priority
            </DialogContentText>
          ) : (
            ''
          )}
          <input
            required
            type="radio"
            id="low"
            name="priority"
            value="low"
            {...(props.dialogType === 'update' && props.value.priority === 'low'
              ? 'checked'
              : '')}
            onChange={(e) => setPriority(e.target.value)}
          ></input>
          <label for="low">Low</label>
          <input
            type="radio"
            id="medium"
            name="priority"
            value="medium"
            {...(props.dialogType === 'update' &&
            props.value.priority === 'medium'
              ? 'checked'
              : '')}
            onChange={(e) => setPriority(e.target.value)}
          ></input>
          <label for="medium">Medium</label>
          <input
            type="radio"
            id="high"
            name="priority"
            value="high"
            required
            {...(props.dialogType === 'update' &&
            props.value.priority === 'high'
              ? 'checked'
              : '')}
            onChange={(e) => setPriority(e.target.value)}
          ></input>
          <label for="high">High</label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNoInput}>Cancel</Button>
          <Button onClick={checkBeforeAdd}>
            {props.dialogType === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
