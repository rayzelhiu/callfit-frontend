import { useMemo } from "react";

export default function ExerciseForm({ form, setForm }) {

  const previewVideo = useMemo(() => {
    if (!form.video) return null;
    return URL.createObjectURL(form.video);
  }, [form.video]);

  const previewThumbnail = useMemo(() => {
    if (!form.thumbnail) return null;
    return URL.createObjectURL(form.thumbnail);
  }, [form.thumbnail]);

  return (
    <>
      {/* NAME */}
      <input
        className="form-control mb-3"
        placeholder="Exercise name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      {/* DESCRIPTION */}
      <textarea
        className="form-control mb-3"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      {/* CATEGORY */}
      <select
        className="form-control mb-3"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        <option value="warmup">Warmup</option>
        <option value="workout">Workout</option>
        <option value="cooldown">Cooldown</option>
      </select>

      {/* VIDEO */}
      <div className="mb-3">
        <label className="fw-bold">Video</label>
        <input
          type="file"
          className="form-control"
          accept="video/*"
          onChange={(e) =>
            setForm({ ...form, video: e.target.files[0] })
          }
        />
      </div>

      {/* VIDEO PREVIEW (SMALL) */}
      {previewVideo && (
        <video
          controls
          style={{
            width: "100%",
            maxHeight: 160,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <source src={previewVideo} />
        </video>
      )}

      {/* THUMBNAIL */}
      <div className="mb-3">
        <label className="fw-bold">Thumbnail</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, thumbnail: e.target.files[0] })
          }
        />
      </div>

      {/* THUMBNAIL PREVIEW (SMALL) */}
      {previewThumbnail && (
        <img
          src={previewThumbnail}
          style={{
            width: "100%",
            maxHeight: 140,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      )}
    </>
  );
}