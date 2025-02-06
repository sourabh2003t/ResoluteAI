'use client'

// React Imports
import { useState, useEffect } from 'react'

import { RadioGroup, FormControlLabel, Radio, FormLabel, Checkbox, FormHelperText } from '@mui/material'

// MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button' 
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { getAuth } from 'firebase/auth';

// Import db Firestore instance
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'

import { db } from '../../../firebase'

// import VerticalMenu from '../layout/vertical/VerticalMenu';


const TicketPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: '',

    // attachment: null,
    contactEmail: '',
    phoneNumber: '',
    dueDate: '',
    status: '',
    assignedDepartment: '',
    impactLevel: '',
    preferredContactMethod: '',
    acknowledgment: false
  })

  const [openModal, setOpenModal] = useState(false) // Modal state
  const [tickets, setTickets] = useState([]) // State for storing ticket data

  const fetchTickets = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        console.error('User not logged in!');

        return;
      }
  
      let ticketsQuery;
  
      if (user.email === 'agent@support.com') {

        // Admin: Fetch all tickets
        ticketsQuery = collection(db, 'submissions');
      } else {

        // Regular user: Fetch only their own tickets
        ticketsQuery = query(collection(db, 'submissions'), where('createdBy', '==', user.email));
      }
  
      const querySnapshot = await getDocs(ticketsQuery);
      const ticketsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  
      setTickets(ticketsData); // Store tickets in state
    } catch (error) {
      console.error('Error fetching tickets: ', error);
    }
  };
  
  

  useEffect(() => {
    fetchTickets() // Fetch tickets when the component mounts
  }, [])
  
  // Empty array ensures it runs only once on mount

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault();
  
    // Simple validation
    if (!formData.title || !formData.contactEmail) {
      alert('Title and Email are required.');

      return;
    }
  
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        alert('User not logged in!');
        
        return;
      }
  
      const submissionData = {
        ...formData,
        createdBy: user.email, // Store the logged-in user's email
        timestamp: new Date()
      };
  
      await addDoc(collection(db, 'submissions'), submissionData);
      alert('Form submitted successfully!');
      setOpenModal(false); // Close modal after submission
      setTickets([...tickets, submissionData]);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Submission failed!');
    }
  };
  

  const handleEdit = ticket => {
    setFormData(ticket) // Assuming you want to pre-fill the form with existing ticket data
    setOpenModal(true)
  }

  const handleDelete = async ticketId => {
    try {
      await deleteDoc(doc(db, 'submissions', ticketId))
      setTickets(tickets.filter(ticket => ticket.id !== ticketId))
      alert('Ticket deleted successfully!')
    } catch (error) {
      console.error('Error deleting ticket: ', error)
      alert('Failed to delete ticket')
    }
  }

  return (
    <Card>
      <div className='flex justify-end p-4'>
        <Button variant='contained' onClick={() => setOpenModal(true)}>
          Raise Ticket
        </Button>
      </div>
      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(ticket => (
              <TableRow key={ticket.id} hover>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell>
                  <Tooltip title='View'>
                    <IconButton
                      size='small'
                      onClick={() => handleEdit(ticket)}
                      sx={{
                        color: 'inherit',
                        '&:hover': { color: 'green' }
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Edit'>
                    <IconButton
                      size='small'
                      onClick={() => handleEdit(ticket)}
                      sx={{
                        color: 'inherit',
                        '&:hover': { color: '#8C57FF' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <IconButton
                      size='small'
                      onClick={() => handleDelete(ticket.id)}
                      sx={{
                        color: 'inherit',
                        '&:hover': { color: 'red' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth='md'
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '20px' }}>Raise New Ticket</DialogTitle>
        <DialogContent sx={{ paddingY: '10px', paddingX: '0' }}>
          {' '}
          <form className='flex flex-col gap-4 mt-4 w-full' onSubmit={handleSubmit}>
            <TextField
              label='Title'
              name='title'
              fullWidth
              value={formData.title}
              onChange={handleChange}
              sx={{ borderRadius: '8px' }}
            />
            <TextField
              label='Description'
              name='description'
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={handleChange}
              sx={{ borderRadius: '8px' }}
            />

            <FormControl fullWidth >
              <InputLabel>Priority</InputLabel>
              <Select label='Category' name='priority' value={formData.priority} onChange={handleChange}>
                <MenuItem value='High'>High</MenuItem>
                <MenuItem value='Low'>Low</MenuItem>
                <MenuItem value='Medium'>Medium</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth >
              <InputLabel>Category</InputLabel>
              <Select label='Category' name='category' value={formData.category} onChange={handleChange}>
                <MenuItem value='Bug Report'>Bug Report</MenuItem>
                <MenuItem value='Feature Request'>Feature Request</MenuItem>
                <MenuItem value='Performance Issue'>Performance Issue</MenuItem>
                <MenuItem value='Security Concern'>Security Concern</MenuItem>
                <MenuItem value='Other'>Other</MenuItem>
              </Select>
            </FormControl>

            {/* <TextField
              label='Attachment'
              type='file'
              fullWidth
              value={formData.attachment}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
              sx={{ borderRadius: '8px', backgroundColor: '#F9FAFB' }}
            /> */}

            <TextField
              label='Email'
              name='contactEmail'
              type='email'
              fullWidth
              value={formData.contactEmail}
              onChange={handleChange}
              sx={{ borderRadius: '8px' }}
            />

            <TextField
              label='Phone Number'
              name='phoneNumber'
              type='number'
              fullWidth
              value={formData.phoneNumber}
              onChange={handleChange}
              sx={{ borderRadius: '8px' }}
            />

            <TextField
              label='Due Date'
              name='dueDate'
              type='date'
              fullWidth
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
              sx={{ borderRadius: '8px' }}
            />

            <FormControl fullWidth >
              <InputLabel>Status</InputLabel>
              <Select label='Status' name='status' value={formData.status} onChange={handleChange}>
                <MenuItem value='Open'>Open</MenuItem>
                <MenuItem value='In Progress'>In Progress</MenuItem>
                <MenuItem value='Resolved'>Resolved</MenuItem>
                <MenuItem value='Closed'>Closed</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth >
              <InputLabel>Assigned Department</InputLabel>
              <Select
                label='Assigned Department'
                name='assignedDepartment'
                value={formData.assignedDepartment}
                onChange={handleChange}
              >
                <MenuItem value='IT'>IT</MenuItem>
                <MenuItem value='Support'>Support</MenuItem>
                <MenuItem value='Development'>Development</MenuItem>
                <MenuItem value='HR'>HR</MenuItem>
                <MenuItem value='Finance'>Finance</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth >
              <InputLabel>Impact Level</InputLabel>
              <Select label='Impact Level' name='impactLevel' value={formData.impactLevel} onChange={handleChange}>
                <MenuItem value='Individual'>Individual</MenuItem>
                <MenuItem value='Team'>Team</MenuItem>
                <MenuItem value='Organization-wide'>Organization-wide</MenuItem>
              </Select>
            </FormControl>

            <FormControl component='fieldset'>
              <FormLabel component='legend'>Preferred Contact Method</FormLabel>
              <RadioGroup
                row
                name='preferredContactMethod'
                value={formData.preferredContactMethod}
                onChange={handleChange}
              >
                <FormControlLabel value='Email' control={<Radio />} label='Email' />
                <FormControlLabel value='Phone' control={<Radio />} label='Phone' />
              </RadioGroup>
            </FormControl>

            <FormControlLabel
              control={<Checkbox checked={formData.acknowledgment} onChange={handleChange} />}
              label='I confirm all the details I provided.'
              name='acknowledgment'
            />

            <div className='flex justify-end gap-2 mt-4'>
              <Button onClick={() => setOpenModal(false)} variant='outlined' color='error'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='primary' onSubmit={handleSubmit}>
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default TicketPage
