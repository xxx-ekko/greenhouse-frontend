// src/pages/Sensors/SensorsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import api from "../../api/api";
import "./SensorsPage.css";

// Dire à la modal quel est l'élément principal de ton app (pour l'accessibilité
Modal.setAppElement("#root");

function SensorsPage() {
  // ---  State pour gérer la popup clé API ---
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  // ---------------------------------------------

  // --- State pour la liste des capteurs ---
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  // ---------------------------------------------

  // --- State pour le formulaire d'ajout ---
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [feedback, setFeedback] = useState({
    message: "",
    isError: false,
    key: 0,
  });
  // ---------------------------------------------

  // --- State pour la modification ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sensorToEdit, setSensorToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    type: "",
    location: "",
  });
  // ---------------------------------------------

  const navigate = useNavigate();

  // Fonction pour récupérer la liste des capteurs
  const fetchSensors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sensors");
      setSensors(response.data);
    } catch (error) {
      console.error("Failed to fetch sensors", error);
      setFeedback({
        message: "Could not load sensors.",
        isError: true,
        key: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  // On charge les capteurs au premier chargement de la page
  useEffect(() => {
    fetchSensors();
  }, []);

  // Logique pour le formulaire d'ajout
  const handleAddSensor = async (e) => {
    e.preventDefault();
    try {
      await api.post("/sensors", { name, type, location });
      setFeedback({
        message: "Sensor added successfully!",
        isError: false,
        key: Date.now(),
      });
      // On rafraîchit la liste des capteurs et on vide le formulaire
      fetchSensors();
      setAddFormData({ name: "", type: "", location: "" }); // Reset form
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add sensor.";
      setFeedback({ message: errorMessage, isError: true, key: Date.now() });
    }
  };
  // ---------------------------------------------

  //Logique pour Supprimer un capteur
  const handleDeleteSensor = async (sensorId) => {
    // On demande une confirmation à l'utilisateur
    if (
      window.confirm(
        "Are you sure you want to delete this sensor? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/sensors/${sensorId}`);
        // On rafraîchit la liste des capteurs pour que celui supprimé disparaisse
        fetchSensors();
      } catch (error) {
        console.error("Failed to delete sensor", error);
        setFeedback({
          message: "Failed to delete sensor.",
          isError: true,
          key: Date.now(),
        });
      }
    }
  };
  // ---------------------------------------------

  // --- Fonctions pour la popup API ---
  const openKeyModal = (sensor) => {
    setSelectedSensor(sensor);
    setIsKeyModalOpen(true);
    setCopyButtonText("Copy"); // Réinitialise le texte du bouton
  };

  const closeKeyModal = () => {
    setIsKeyModalOpen(false);
    setSelectedSensor(null);
  };

  const handleCopyKey = () => {
    if (selectedSensor) {
      navigator.clipboard.writeText(selectedSensor.api_key);
      setCopyButtonText("Copied!");
    }
  };
  // ------------------------------------------

  // --- Fonctions pour la modification ---
  const openEditModal = (sensor) => {
    setSensorToEdit(sensor);
    setEditFormData({
      name: sensor.name,
      type: sensor.type || "",
      location: sensor.location || "",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSensorToEdit(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSensor = async (e) => {
    e.preventDefault();
    if (!sensorToEdit) return;
    try {
      await api.put(`/sensors/${sensorToEdit.id}`, editFormData);
      closeEditModal();
      fetchSensors(); // Rafraîchit la liste
    } catch (error) {
      console.error("Failed to update sensor", error);
      setFeedback({
        message: "Failed to update sensor",
        error,
      });
    }
  };
  // ------------------------------------------

  return (
    <div className="page-content">
      <h1>Manage Sensors</h1>
      {/*Formulaire d'ajout*/}
      <div className="form-container">
        <h2>Add a New Sensor</h2>
        <form onSubmit={handleAddSensor}>
          <div className="form-group">
            <label htmlFor="name">Sensor Name (Required)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Sensor Type (e.g., DHT22)</label>
            <input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit">Add Sensor</button>
        </form>
        {feedback.message && (
          <p
            key={feedback.key}
            className={
              feedback.isError
                ? "feedback-message error shake-error"
                : "feedback-message success"
            }
          >
            {feedback.message}
          </p>
        )}
      </div>
      {/*Formulaire de suppression*/}
      <hr className="separator" />

      <h2>Your Sensors</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="sensors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => (
              <tr key={sensor.id}>
                <td data-label="Name">{sensor.name}</td>
                <td data-label="Type">{sensor.type || "-"}</td>
                <td data-label="Location">{sensor.location || "-"}</td>
                <td data-label="Actions">
                  {/* --- Bouton "EDIT" --- */}
                  <button
                    onClick={() => openEditModal(sensor)}
                    className="btn btn-edit"
                  >
                    Edit
                  </button>
                  {/* --- Bouton "Show Key" --- */}
                  <button
                    onClick={() => openKeyModal(sensor)}
                    className="btn btn-info"
                  >
                    Show Key
                  </button>
                  {/* --- Bouton "Delete" --- */}
                  <button
                    onClick={() => handleDeleteSensor(sensor.id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>

                  {/* On ajoutera les autres boutons ici */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* --- La popup (Modal) --- */}
      {selectedSensor && (
        <Modal
          isOpen={isKeyModalOpen}
          onRequestClose={closeKeyModal}
          contentLabel="API Key Modal"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>API Key for "{selectedSensor.name}"</h2>
          <p>
            This is the unique key for your physical device. Configure it in
            your sensor's setup page.
          </p>
          <div className="api-key-box">{selectedSensor.api_key}</div>
          <div className="modal-actions">
            <button onClick={handleCopyKey} className="btn btn-copy">
              {copyButtonText}
            </button>
            <button onClick={closeKeyModal} className="btn">
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* --- La popup pour la modification --- */}
      {sensorToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Sensor Modal"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Edit "{sensorToEdit.name}"</h2>
          <form onSubmit={handleUpdateSensor}>
            <div className="form-group">
              <label>Sensor Name</label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Sensor Type</label>
              <input
                type="text"
                name="type"
                value={editFormData.type}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={editFormData.location}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={closeEditModal} className="btn">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default SensorsPage;
