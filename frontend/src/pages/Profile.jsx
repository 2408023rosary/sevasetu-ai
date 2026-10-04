import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Clock3,
  Edit3,
} from "lucide-react";

function Profile() {
  // Temporary mock user data.
  // This will later come from the authentication API.
  const user = {
    name: "Citizen User",
    email: "citizen@example.com",
    phone: "+91 98765 43210",
    location: "Goa, India",
  };

  const stats = {
    total: 3,
    pending: 2,
    resolved: 1,
  };

  return (
    <div className="profile-page">

      {/* HEADER */}

      <header className="complaint-header">

        <Link
          to="/dashboard"
          className="complaint-back"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="complaint-brand">
          <strong>SevaSetu</strong>
          <span>My profile</span>
        </div>

      </header>


      {/* MAIN */}

      <main className="profile-main">

        {/* HEADING */}

        <section className="profile-heading">

          <span className="dashboard-eyebrow">
            Account
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your account information and view
            your complaint activity.
          </p>

        </section>


        {/* PROFILE HERO */}

        <section className="profile-card profile-hero">

          <div className="profile-avatar">
            <User size={34} />
          </div>

          <div className="profile-identity">

            <h2>{user.name}</h2>

            <p>
              Citizen account
            </p>

          </div>

          <button
            type="button"
            className="profile-edit-button"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>

        </section>


        {/* INFORMATION */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon">
              <User size={19} />
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>
                Your basic account information.
              </p>
            </div>

          </div>


          <div className="profile-info-grid">

            <div className="profile-info-item">

              <Mail size={18} />

              <div>
                <span>Email Address</span>
                <strong>{user.email}</strong>
              </div>

            </div>


            <div className="profile-info-item">

              <Phone size={18} />

              <div>
                <span>Phone Number</span>
                <strong>{user.phone}</strong>
              </div>

            </div>


            <div className="profile-info-item">

              <MapPin size={18} />

              <div>
                <span>Location</span>
                <strong>{user.location}</strong>
              </div>

            </div>


            <div className="profile-info-item">

              <ShieldCheck size={18} />

              <div>
                <span>Account Status</span>
                <strong className="account-active">
                  Active
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* COMPLAINT STATISTICS */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon">
              <FileText size={19} />
            </div>

            <div>
              <h2>Complaint Activity</h2>
              <p>
                A quick overview of your reported issues.
              </p>
            </div>

          </div>


          <div className="profile-stats">

            <div className="profile-stat">

              <div className="profile-stat-icon">
                <FileText size={18} />
              </div>

              <span>Total Complaints</span>

              <strong>
                {stats.total}
              </strong>

            </div>


            <div className="profile-stat">

              <div className="profile-stat-icon">
                <Clock3 size={18} />
              </div>

              <span>Pending</span>

              <strong>
                {stats.pending}
              </strong>

            </div>


            <div className="profile-stat">

              <div className="profile-stat-icon">
                <CheckCircle2 size={18} />
              </div>

              <span>Resolved</span>

              <strong>
                {stats.resolved}
              </strong>

            </div>

          </div>

        </section>


        {/* ACTIONS */}

        <section className="profile-actions">

          <Link
            to="/my-complaints"
            className="secondary-button"
          >
            View My Complaints
          </Link>

          <Link
            to="/create-complaint"
            className="primary-button"
          >
            Report an Issue
          </Link>

        </section>


        {/* SECURITY */}

        <div className="profile-security">

          <ShieldCheck size={17} />

          <span>
            Your account information is securely stored
            and used only for providing SevaSetu services.
          </span>

        </div>

      </main>

    </div>
  );
}

export default Profile;