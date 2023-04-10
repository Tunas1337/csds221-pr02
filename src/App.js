import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import '@mui/material';
import Button from '@mui/material/Button';
import AddUpdateDialog from './AddUpdateDialog.js';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState('add');
  const [editedTitle, setEditedTitle] = React.useState('');
  const [editedDescription, setEditedDescription] = React.useState('');
  const [editedDeadline, setEditedDeadline] = React.useState('');
  const [editedPriority, setEditedPriority] = React.useState('');
  // Make a tasks state array to store the tasks
  const [tasks, setTasks] = React.useState([
    {
      title: 'Task 1',
      description: 'Description 1',
      deadline: '2021-10-01',
      priority: 'low',
      isComplete: false,
    },
  ]);
  const handleClickOpen = (isAdd, title, description, priority, deadline) => {
    setOpen(true);
    setDialogType(isAdd);
    if (isAdd === 'update') {
      setEditedTitle(title);
      setEditedDescription(description);
      setEditedDeadline(deadline);
      setEditedPriority(priority);
    }
  };

  const onDialogClose = (value) => {
    // Close the AddUpdateDialog
    setOpen(false);
    // If we are adding a task and the returned value isn't empty, add the task to the tasks array
    if (dialogType === 'add' && value) {
      setTasks([...tasks, value]);
    }
    // If we are updating a task and the returned value isn't empty, update the task in the tasks array
    if (dialogType === 'update' && value) {
      // Find the index of the task we are updating
      const index = tasks.findIndex((task) => task.title === editedTitle);
      // Update the task in the tasks array
      tasks[index] = value;
      // Restore the title of the task
      tasks[index].title = editedTitle;
      // Update the tasks state array
      setTasks([...tasks]);
    }
  };

  const showToast = (message) => {
    toastr.options = {
      positionClass: 'toast-bottom-right',
      hideDuration: 300,
      timeOut: 60000,
    };
    toastr.clear();
    setTimeout(() => toastr.success(message), 150);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Navbar bg="primary" variant="dark" className="justify-content-between">
          {/* Center the Brand text */}
          <Navbar.Text className="justify-content-center">
            <Button variant="primary">
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </Navbar.Text>
          <Navbar.Brand className="center">FRAMEWORKS</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Button
              variant="contained"
              className="mybutton add"
              onClick={() => handleClickOpen('add', null)}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              &nbsp;ADD
            </Button>
          </Navbar.Collapse>
        </Navbar>
      </header>
      <AddUpdateDialog
        open={open}
        onClose={onDialogClose}
        showToast={showToast}
        dialogType={dialogType}
        value={{
          description: editedDescription,
          deadline: editedDeadline,
          priority: editedPriority,
        }}
        tasks={tasks}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Deadline</TableCell>
              <TableCell align="right">Priority</TableCell>
              <TableCell align="right">Is Complete</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((row) => (
              <TableRow
                key={row.title}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{row.deadline}</TableCell>
                <TableCell align="right">{row.priority}</TableCell>
                <TableCell align="right">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      row.isComplete = !row.isComplete;
                      // Hack to force a rerender
                      setTasks([...tasks]);
                    }}
                  ></input>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="error"
                    className="mybutton"
                    onClick={() => {
                      setTasks(
                        tasks.filter((task) => task.title !== row.title)
                      );
                      showToast('Task deleted');
                    }}
                  >
                    Delete
                  </Button>
                  {row.isComplete ? null : (
                    <Button
                      variant="contained"
                      color="primary"
                      className="mybutton"
                      onClick={() => {
                        handleClickOpen(
                          'update',
                          row.title,
                          row.description,
                          row.priority,
                          row.deadline
                        );
                      }}
                    >
                      Update
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
