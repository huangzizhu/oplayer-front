<template>
  <div class="card" :class="color">
    <div class="card-header">
      <div class="date">{{ date }}</div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="card-body">
      <h3>{{ name }}</h3>
      <p>{{ artist }}</p>
      <div class="progress">
        <span>Progress</span>
        <div class="progress-bar"></div>
        <span>{{ progress }}%</span>
      </div>
    </div>
    <div class="card-footer">
      <ul>
        <a href="#" class="btn-add">
        </a>
      </ul>
      <a href="#" class="btn-countdown">{{ daysBefore }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    color: {
      type: String,
      required: true,
      validator: value => ['green', 'blue', 'orange', 'red'].includes(value)
    },
    date: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    artist: {
      type: String,
      required: true
    },
    progress: {
      type: Number,
      required: true,
      validator: value => value >= 0 && value <= 100
    },
    daysBefore: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.card {
  position: relative;
  z-index: 555;
  max-width: 325px;
  min-height: 325px;
  width: 100%;
  display: grid;
  place-content: center;
  place-items: center;
  text-align: center;
  position: relative;
  box-shadow: 0.063em 0.75em 1.563em rgb(0 0 0 / 78%);
  border-radius: 2.25rem;
}

.card::before {
  position: absolute;
  content: "";
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 2.25rem;
  z-index: -1;
  border: 0.155rem solid transparent;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box,
  linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
}

.card-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8em 0.5em 0em 1.5em;
}

.card-header .date {
  color: #ddd;
}

.card-header svg {
  color: #fff;
  width: 2.5rem;
  cursor: pointer;
}

.card-body {
  position: absolute;
  width: 100%;
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.7em 1.25em 0.5em 1.5em;
}

.card-body h3 {
  color: #fff;
  font-size: 1.375rem;
  margin-top: 0.625em;
  margin-bottom: 0.188em;
  text-transform: capitalize;
  font-weight: 600;
}

.card-body p {
  color: #ddd;
  font-size: 1rem;
  letter-spacing: 0.031rem;
}

.card-body .progress {
  margin-top: 0.938rem;
}

.card-body .progress .progress-bar {
  position: relative;
  width: 100%;
  background: #363636;
  height: 0.313rem;
  display: block;
  border-radius: 3.125rem;
}

.card-body .progress .progress-bar:after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  display: block;
  border-radius: 3.125rem;
}

.card-body .progress span:first-of-type {
  color: #fff;
  text-align: left;
  font-weight: 600;
  width: 100%;
  display: block;
  margin-bottom: 0.313rem;
}

.card-body .progress span {
  margin-top: 0.313rem;
  text-align: right;
  display: block;
  color: #fff;
}

.card-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  border-top: 0.063rem solid #292929;
  display: flex;
  justify-content: space-between;
  padding: 0.7em 1.25em 0.5em 1.5em;
  background: #151419;
  border-bottom-left-radius: 2.25rem;
  border-bottom-right-radius: 2.25rem;
}

.card-footer ul {
  display: flex;
  align-items: center;
}

.card-footer ul li {
  list-style-type: none;
  display: flex;
  margin-right: -0.625rem;
}

.card-footer ul li img {
  border-radius: 50%;
  width: 1.875rem;
  height: 1.875rem;
  object-fit: cover;
}

.card-footer .btn-add {
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-footer .btn-add svg {
  width: 1rem;
}

.card-footer .btn-countdown {
  background: #222127;
  color: #fff;
  border-radius: 2em;
  padding: 0.625rem 1.5rem;
}

/* Color specific styles */
.green {
  background: radial-gradient(
      ellipse at right top,
      #107667ed 0%,
      #151419 47%,
      #151419 100%
  );
}

.green:before {
  background: linear-gradient(
      45deg,
      #232228,
      #232228,
      #232228,
      #232228,
      #01c3a8
  )
  border-box;
}

.green .btn-add {
  background: #01c3a8;
}

.green .progress-bar:after {
  width: v-bind(progress + '%');
  background: #01c3a8;
}

.green .btn-countdown:hover {
  background: #01c3a8;
}

.blue {
  background: radial-gradient(
      ellipse at right top,
      #00458f8f 0%,
      #151419 45%,
      #151419 100%
  );
}

.blue:before {
  background: linear-gradient(
      45deg,
      #232228,
      #232228,
      #232228,
      #232228,
      #1890ff
  )
  border-box;
}

.blue .btn-add {
  background: #1890ff;
}

.blue .progress-bar:after {
  width: v-bind(progress + '%');
  background: #1890ff;
}

.blue .btn-countdown:hover {
  background: #1890ff;
}

.orange {
  background: radial-gradient(
      ellipse at right top,
      #ffb74194 0%,
      #151419 47%,
      #151419 100%
  );
}

.orange:before {
  background: linear-gradient(
      45deg,
      #232228,
      #232228,
      #232228,
      #232228,
      #ffb741
  )
  border-box;
}

.orange .btn-add {
  background: #ffb741;
}

.orange .progress-bar:after {
  width: v-bind(progress + '%');
  background: #ffb741;
}

.orange .btn-countdown:hover {
  background: #ffb741;
}

.red {
  background: radial-gradient(
      ellipse at right top,
      #a63d2a82 0%,
      #151419 47%,
      #151419 100%
  );
}

.red:before {
  background: linear-gradient(
      45deg,
      #232228,
      #232228,
      #232228,
      #232228,
      #a63d2a
  )
  border-box;
}

.red .btn-add {
  background: #a63d2a;
}

.red .progress-bar:after {
  width: v-bind(progress + '%');
  background: #a63d2a;
}

.red .btn-countdown:hover {
  background: #a63d2a;
}
</style>