from threading import Thread, Lock
from queue import Queue
import threading

q = Queue(maxsize=0)
mq = Queue(maxsize=0)

def execute_next():
	global q, lock
	while True:
		(fn, args) = q.get()
		fn(args)
		q.task_done()

def execute_mq():
	global mq, lock
	while True:
		(fn, args) = mq.get()
		fn(args)
		mq.task_done()

def initialize(thread_count=4):
	for i in range(thread_count - 1):
		worker = Thread(target=execute_next)
		worker.daemon = True
		worker.start()

	mq_worker = Thread(target=execute_mq)
	mq_worker.daemon = True
	mq_worker.start()
