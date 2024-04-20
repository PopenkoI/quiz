import React, { useEffect } from 'react'
import { Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Center from './Center'
import useForm from '../hooks/useForm'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import useStateContext from '../hooks/useStateContext'
import { useNavigate } from 'react-router'

const getFreshModel = () => ({
    name: '',
    email: ''
})

export default function Login() {

    const { context, setContext, resetContext } = useStateContext();
    const navigate = useNavigate()

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    } = useForm(getFreshModel);

    useEffect(() => {
        resetContext()
    }, [])


    const login = e => {
        e.preventDefault();
        if (validate())
            createAPIEndpoint(ENDPOINTS.participant)
                .post(values)//email,name
                .then(res => {
                    setContext({ participantId: res.data.participantId })
                    navigate('/quiz')
                })
                .catch(err => console.log(err))
    }

    const validate = () => {
        let temp = {}
        temp.email = (/\S+@\S+\.\S+/).test(values.email) ? "" : "Email is not valid."
        temp.name = values.name != "" ? "" : "This field is required."
        setErrors(temp)//вертаємо ерорку
        return Object.values(temp).every(x => x == "")//результат валідацції
    }

    return (
        <Center>
            <Card sx={{ width: 400 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ my: 3 /*margin-top, margin-bottom, header*/ }}>
                        Quiz App
                    </Typography>
                    <Box sx={{//mui component  ==div
                        '& .MuiTextField-root': { //child component for elem Box (TextFields)
                            m: 1,  //margin
                            width: '90%' //multiple lines
                        }
                    }}>
                        <form noValidate autoComplete="off" onSubmit={login}>
                            <TextField  //mui component
                                label="Email"
                                name="email"
                                value={values.email}
                                onChange={handleInputChange}
                                variant="outlined"
                                {...(errors.email && { error: true, helperText: errors.email })} />
                            <TextField  //mui component
                                label="Name"
                                name="name"
                                value={values.name}
                                onChange={handleInputChange}
                                variant="outlined"
                                {...(errors.name && { error: true, helperText: errors.name })} />
                            <Button  //mui component
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{ width: '90%' }}>Start</Button>
                        </form>
                    </Box>
                </CardContent>
            </Card>
        </Center>
    )
}
