# limestone-consul
Consul cluster on AWS with autoscaling

This repository includes assets referred to in the blog [Consul cluster in AWS with auto scaling] (https://limecodeblog.wordpress.com/2016/09/19/consul-cluster-in-aws-with-auto-scaling/)

You can deploy the stack either manually using the AWS console or by using the *create-consul-stack* script found in this repo.

##  Prerequisites
To deploy the stack using the script you need run on Mac or Linux and have:

- [AWS CLI] (https://aws.amazon.com/cli/) installed and configured
- [jq] (https://stedolan.github.io/jq/download/) installed
- AWS permissions to create VPC, EC2, SNS and Lambda resources
- An AWS S3 bucket. This will be used to upload the Cloudformation templates.
- An AWS Key Pair.
The Cloudformation template used in this post currently only supports deployment in the EU or US regions.

## Create the stack
1. Clone this GitHub repo.
2. Run the script to create the Consul cluster. Replace &lt;your_stack_name&gt; with a name that choose for your stack. Replace &lt;s3_bucket&gt; with the name of your S3 bucket. Replace &lt;s3_folder&gt; with the folder to use within the bucket (must start with a ‘/’). Replace &lt;key_pair_name&gt; with the name of your EC2 Key Pair name. Replace &lt;availability_zones&gt; with a list of two availability zones to be used, e.g. eu-west-1a,eu-west-1b
```
    cd limestone-consul/cloudformation
    chmod 700 create-consul-stack
    ./create-consul-stack &lt;your_stack_name&gt; &lt;s3_bucket&gt; &lt;s3_folder&gt; &lt;key_pair_name&gt; &lt;availability_zones&gt;
```
Example:
```
./create-consul-stack Consul MyConsulBucket / keypair eu-west-1a,eu-west-1b
```
The scripts does the following:

1. Zip the NodeJS code for the Lambda function
2. Upload the Lambda zip file to S3
3. Upload the Cloudformation templates for the VPC and Consul stacks to S3
4. Creates the stack using AWS CLI
5. Waits for the stack to be created. Go and grab a coffee, it will take some minutes to complete.
6. Outputs the URL where the Consul GUI can be accessed. The user name for the Gonsul GUI is admin and the default password is conSuL@aws1.
