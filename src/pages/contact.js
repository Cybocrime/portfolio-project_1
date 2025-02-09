import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import { string, object } from "yup";
import PhoneIcon from "@mui/icons-material/Phone";

const Contact = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,cca3"
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const validationSchema = object({
    name: string().min(3, "Too short").max(50, "Too long").required("Required"),
    email: string().email("Invalid email").required("Required"),
    message: string().min(10, "Too short").required("Required"),
    country: string().required("Required"),
    phone: string()
      .matches(/^\+?\d{7,15}$/, "Invalid phone number")
      .required("Required"),
    postcode: string().matches(/^\d{4,10}$/, "Invalid postcode").optional(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
      country: "",
      phone: "",
      postcode: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Update the API call with the full Vercel endpoint URL
        await axios.post("https://emailsend-six.vercel.app/api/sendEmail", values);

        setSnackbarMessage("Message sent successfully!");
        resetForm();
      } catch (error) {
        console.error("Email sending error:", error);
        setSnackbarMessage("There was an error sending the message.");
      } finally {
        setOpenSnackbar(true);
      }
    },
  });

  return (
    <Box>
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          Have a question or need assistance? Fill out the form below, and we&lsquo;ll get back to you as soon as possible.
        </Typography>
      </Box>

      <Box sx={{ mt: 4, mb: 15, display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
        <Box sx={{ flex: 1, padding: 2, backgroundColor: "#fff", borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <PhoneIcon sx={{ fontSize: "2em", marginRight: 1, color: "#3a7de8" }} />
            <Typography variant="body1">
              <strong>0240024512 / 0504484966</strong>
            </Typography>
          </Box>
          <Typography variant="h6" component="h2" gutterBottom>
            Our Location
          </Typography>
          <Box sx={{ width: "100%", height: { xs: 100, md: 450 } }}>
            <iframe
              src="https://www.google.com/maps/embed?... (your map URL)"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>
        </Box>

        <Box sx={{ flex: 1, padding: 2, backgroundColor: "#fff", boxShadow: 3, borderRadius: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                select
                label="Country"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={formik.touched.country && formik.errors.country}
                margin="normal"
              >
                <MenuItem value="" disabled>Select your country</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.cca3} value={country.name.common}>
                    {country.name.common}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Postcode (Optional)"
                name="postcode"
                value={formik.values.postcode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.postcode && Boolean(formik.errors.postcode)}
                helperText={formik.touched.postcode && formik.errors.postcode}
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2, width: "100%" }}>
                Send Message
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Contact;
