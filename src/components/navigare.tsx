import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SearchAppBar from './search';
import { useReadCypher } from 'use-neo4j';
import { useState, useEffect } from 'react';
import Graph from './graph';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

const drawerWidth = 240;

interface Note {
  name: string;
  expanded: boolean,
  subnotes: Subnote[]
}

interface Subnote {
  name: string;
  expanded: boolean,
  subnotes: string[]
}

export default function PermanentDrawerLeft() {

  const [notes, setNotes] = useState<any>([]);

  const [data, setData] = useState([
    {
      name: 'Note1',
      expanded: false,
      subnotes: [
        {
          name: '1Subnote1',
          subnotes: ['1_sub1_subnote1', '1_sub1_subnote2', '1_sub1_subnote3'],
          expanded: false,
        },
        {
          name: '1Subnote2',
          subnotes: ['1_sub2_subnote1', '1_sub2_subnote2', '1_sub2_subnote3'],
          expanded: false,
        },
        {
          name: '1Subnote3',
          subnotes: ['1_sub3_subnote1', '1_sub3_subnote2', '1_sub3_subnote3'],
          expanded: false,
        },
      ]
    },
    {
      name: 'Note2',
      expanded: false,
      subnotes: [
        {
          name: '2Subnote1',
          subnotes: ['2_sub1_subnote1', '2_sub1_subnote2', '2_sub1_subnote3'],
          expanded: false,
        },
        {
          name: '2Subnote2',
          subnotes: ['2_sub2_subnote1', '2_sub2_subnote2', '2_sub2_subnote3'],
          expanded: false,
        },
        {
          name: '2Subnote3',
          subnotes: ['2_sub3_subnote1', '2_sub3_subnote2', '2_sub3_subnote3'],
          expanded: false,
        },
      ]
    },
    {
      name: 'Note3',
      expanded: false,
      subnotes: [
        {
          name: '3Subnote1',
          subnotes: ['3_sub1_subnote1', '3_sub1_subnote2', '3_sub1_subnote3'],
          expanded: false,
        },
        {
          name: '3Subnote2',
          subnotes: ['3_sub2_subnote1', '3_sub2_subnote2', '3_sub2_subnote3'],
          expanded: false,
        },
        {
          name: '3Subnote3',
          subnotes: ['3_sub3_subnote1', '3_sub3_subnote1', '3_sub3_subnote1'],
          expanded: false,
        },
      ]
    }
  ])

  const [subExpanded, setSubExpanded] = useState([false, false, false]);

  const query = `MATCH (n:Note) RETURN n`
  const params = {}
  
  const { loading, records } = useReadCypher(query, params)


  useEffect(() => {
    const getNotes = records?.map(record => record.get('n'));
    setNotes(getNotes);
  }, [records])

  // useEffect(() => {
  //   console.log(list_raw_data[0].expanded)
  // }, [list_raw_data[0].expanded])

  if (loading) return (<div>Loading...</div>)

  const handleClick = (mynote: Note) => {
    const updateState = data.map(note => {
      if (note === mynote) {
        const expanded = note.expanded;
        return { ...note, expanded: !expanded }
      }
      return note;
    })
    setData(updateState);
  }

  const handleSubNoteClick = (mysubnote: Subnote) => {
    const updateState = data.map(note => {
      note.subnotes = note.subnotes.map(subnote => {
        if (subnote === mysubnote) {
          const expanded = subnote.expanded;
          return { ...subnote, expanded: !expanded }
        }
        return subnote;
      })
      return note;
    })
    setData(updateState);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar sx={{ bgcolor: "black" }}>
          <Typography variant="h6" noWrap component="div">
            Mimir
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'black',
            boxShadow: '3px rgb(0 0 0 / 0.2);'
          },
        }}
        variant="permanent"
        anchor="left"
      >

        <Toolbar />
        <React.Fragment><SearchAppBar></SearchAppBar></React.Fragment>
        <List sx={{ color: "white" }}>
          {data.map((note, index1) => (
            <div>
              <ListItem key={index1} disablePadding onClick={() => handleClick(note)}>
                <ListItemButton>
                  <ListItemText primary={note.name} />
                  {note.expanded ? <ArrowLeftIcon /> : <ArrowDropDownIcon />}
                </ListItemButton>
              </ListItem>
              {note.expanded && note.subnotes.map((subnote, index2) => (
                <List sx={{ backgroundColor: "#111", margin: 0, padding: 0 }}>
                  <ListItem key={index2} disablePadding onClick={() => handleSubNoteClick(subnote)}>
                    <ListItemButton >
                      <ListItemText primary={subnote.name} />
                      {subnote.expanded ? <ArrowLeftIcon /> : <ArrowDropDownIcon />}
                    </ListItemButton>
                  </ListItem>
                  {subnote.expanded && subnote.subnotes.map((subnote, index3) => (
                    <List sx={{ backgroundColor: "#222", margin: 0, padding: 0 }}>
                      <ListItem key={index3} disablePadding>
                        <ListItemButton >
                          <ListItemText primary={subnote} />
                          {/* {subExpanded[index] ? <ArrowLeftIcon /> : <ArrowDropDownIcon />} */}
                        </ListItemButton>
                      </ListItem>
                    </List>
                  ))}
                </List>
              ))}
            </div>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {/* <div>
            {notes && notes.map((note: any) => (
              <div>
                <div><b>Title: </b>{note.properties.title}</div>
                <div><b>Body: </b>{note.properties.body}</div>
              </div>
            )
            )}
          </div> */}
        <Graph />
      </Box>
    </Box >
  );
}
