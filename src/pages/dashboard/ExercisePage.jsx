import {
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { useState } from "react";

export default function ExercisePage({
  search,
  setSearch,
  currentData,
  currentPage,
  setCurrentPage,
  totalPage,
  filteredExercises,
  categoryBadge,
  formatCategory,
  setSelectedVideo,
  setVideoModal,
  setSelectedItem,
  setForm,
  setEditModal,
  setDeleteModal,
  resetForm,
  setAddModal,
}) {

  // ================= IMAGE MODAL STATE =================
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModal, setImageModal] = useState(false);

  // ================= EDIT HANDLER =================
  const handleEdit = (item) => {
    setSelectedItem(item);

    setForm({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "workout",

      video: null,
      thumbnail: null,

      video_url: item.video_url || null,
      thumbnail_url: item.thumbnail_url || null,
    });

    setEditModal(true);
  };

  return (
    <>
      <h1 className="fw-bold">EXERCISE</h1>

      <div className="bg-white rounded-4 shadow-sm p-4 mt-3">

        {/* SEARCH */}
        <div className="row align-items-center g-3 mb-4">
          <div className="col-12 col-lg-8">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch />
              </span>

              <input
                className="form-control border-start-0"
                placeholder="Search exercise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-lg-4 d-flex justify-content-lg-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setAddModal(true);
              }}
            >
              <FaPlus className="me-2" />
              Add Exercise
            </button>
          </div>
        </div>

        <hr />

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">

            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Category</th>
                <th>Thumbnail</th>
                <th>Video</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id}>

                  <td>{(currentPage - 1) * 5 + index + 1}</td>
                  <td>{item.name}</td>

                  <td>
                    <span className={`badge ${categoryBadge(item.category)}`}>
                      {formatCategory(item.category)}
                    </span>
                  </td>

                  {/* ================= THUMBNAIL ================= */}
                  <td>
                    {item.thumbnail_url ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          setSelectedImage(item.thumbnail_url);
                          setImageModal(true);
                        }}
                      >
                        🖼 View
                      </button>
                    ) : (
                      <span className="text-muted">No Thumbnail</span>
                    )}
                  </td>

                  {/* ================= VIDEO ================= */}
                  <td>
                    {item.video_url ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setSelectedVideo(item.video_url);
                          setVideoModal(true);
                        }}
                      >
                        ▶ Video
                      </button>
                    ) : (
                      <span className="text-muted">No Video</span>
                    )}
                  </td>

                  {/* ================= ACTION ================= */}
                  <td>
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

          {/* PAGINATION */}
          <div className="d-flex justify-content-between mt-3">
            <small>
              Showing {currentData.length} of {filteredExercises.length}
            </small>

            <div>
              <button
                className="btn btn-light border me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <FaChevronLeft />
              </button>

              <button
                className="btn btn-light border"
                disabled={currentPage === totalPage}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= IMAGE MODAL ================= */}
      {imageModal && selectedImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,.7)", zIndex: 9999 }}
          onClick={() => setImageModal(false)}
        >
          <img
            src={selectedImage}
            alt="thumbnail"
            style={{
              maxWidth: "80%",
              maxHeight: "80%",
              borderRadius: 12,
            }}
          />
        </div>
      )}
    </>
  );
}