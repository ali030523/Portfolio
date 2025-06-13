document.addEventListener("DOMContentLoaded", () => {
  const steps = ["form-step-1", "form-step-2", "form-step-3"];
  const progressSteps = ["step1", "step2", "step3"];
  let currentStep = 0;

  const showStep = (index) => {
    steps.forEach((id, i) => {
      document.getElementById(id).classList.toggle("hidden", i !== index);
      document.getElementById(progressSteps[i]).classList.toggle("active", i === index);
    });
    currentStep = index;
  };

  // Scroll to form on Book Now click
  document.getElementById("go-to-booking").addEventListener("click", () => {
    document.getElementById("booking-section").scrollIntoView({ behavior: "smooth" });
  });

  // Auto TO value
  document.getElementById("from").addEventListener("change", () => {
    const from = document.getElementById("from").value;
    document.getElementById("to").value =
      from === "Odiongan" ? "Batangas" :
      from === "Batangas" ? "Odiongan" : "";
  });

  // Fare calculator
  const fareMap = {
    "Super Value": 700,
    "Tourist": 900,
    "Cabin": 1200,
    "Suite": 1500
  };

  const updateFare = () => {
    const cls = document.getElementById("class").value;
    const age = parseInt(document.getElementById("age").value);
    let base = fareMap[cls] || 0;
    let discount = 0;

    if (!cls || isNaN(age)) return;

    if (age <= 4) discount = 1;
    else if (age >= 60) discount = 0.2;
    else if (age <= 17) discount = 0.1;

    const finalFare = discount === 1 ? 0 : base - (base * discount);
    document.getElementById("fare").value = `₱${finalFare.toLocaleString()}`;
    document.getElementById("fare").dataset.final = finalFare;
  };

  document.getElementById("class").addEventListener("change", updateFare);
  document.getElementById("age").addEventListener("input", updateFare);

  // Navigation
  document.getElementById("next1").onclick = () => {
    if (validateStep1()) showStep(1);
  };
  document.getElementById("back1").onclick = () => showStep(0);
  document.getElementById("next2").onclick = () => {
    if (validateStep2()) {
      showReview();
      showStep(2);
    }
  };
  document.getElementById("back2").onclick = () => showStep(1);

  // Cancel booking
  document.getElementById("cancel").onclick = () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      window.location.reload();
    }
  };

  // Review before confirm
  const showReview = () => {
    const cls = document.getElementById("class").value;
    let seatNum = (cls === "Suite" || cls === "Cabin")
      ? `Room No. ${Math.floor(100 + Math.random() * 900)}`
      : `Bed No. ${Math.floor(1 + Math.random() * 50)}`;

    const summary = `
      <p><strong>Name:</strong> ${document.getElementById("name").value}</p>
      <p><strong>Gender:</strong> ${document.getElementById("gender").value}</p>
      <p><strong>Age:</strong> ${document.getElementById("age").value}</p>
      <p><strong>From:</strong> ${document.getElementById("from").value}</p>
      <p><strong>To:</strong> ${document.getElementById("to").value}</p>
      <p><strong>Date:</strong> ${document.getElementById("date").value}</p>
      <p><strong>Time:</strong> ${document.getElementById("time").value}</p>
      <p><strong>Class:</strong> ${cls}</p>
      <p><strong>${seatNum}</strong></p>
      <p><strong>Fare:</strong> ${document.getElementById("fare").value}</p>
    `;
    document.getElementById("review-summary").innerHTML = summary;
  };

  // Final Submit
  document.getElementById("booking-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const finalFare = document.getElementById("fare").dataset.final;
    const name = document.getElementById("name").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const cls = document.getElementById("class").value;
    const code = `LS-${Math.floor(100000 + Math.random() * 900000)}`;

    const qrData = `${code}|${name}|${from}->${to}|${date} ${time}|₱${finalFare}`;
    document.getElementById("qr-code").src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    document.getElementById("receipt-text").innerHTML = `
      <strong>Booking Code:</strong> ${code}<br>
      <strong>Name:</strong> ${name}<br>
      <strong>Route:</strong> ${from} ➜ ${to}<br>
      <strong>Date:</strong> ${date} – ${time}<br>
      <strong>Class:</strong> ${cls}<br>
      <strong>Fare:</strong> ₱${parseFloat(finalFare).toLocaleString()}
    `;
    document.getElementById("receipt-modal").classList.remove("hidden");

    // After 4 seconds, reset to landing
    setTimeout(() => {
      document.getElementById("receipt-modal").classList.add("hidden");
      document.getElementById("booking-form").reset();
      document.getElementById("fare").value = "";
      showStep(0);
      document.getElementById("booking-section").scrollIntoView({ behavior: "smooth" });
    }, 4000);
  });

  document.getElementById("close-modal").onclick = () => {
    document.getElementById("receipt-modal").classList.add("hidden");
  };

  // Step 1 validation
  const validateStep1 = () => {
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    if (!name || !age || !gender) {
      alert("Please fill out all required passenger fields.");
      return false;
    }
    return true;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const from = document.getElementById("from").value;
    const dateInput = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const cls = document.getElementById("class").value;

    if (!from || !time || !cls || !dateInput) {
      alert("Please complete all travel details.");
      return false;
    }

    const selectedDate = new Date(dateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today || selectedDate.getFullYear() < 2025) {
      alert("Travel date must be in the future (2025 onwards).");
      return false;
    }

    return true;
  };

  showStep(0); // start at step 1
});

// Scroll progress bar
window.onscroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / scrollHeight) * 100;
  document.getElementById("scroll-progress").style.width = scrolled + "%";
};
